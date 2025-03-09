// React and Related Hooks
import React, { useState, useRef, useEffect } from 'react';

// Notification Library
import toast, { Toaster } from 'react-hot-toast';

// Router
import { Link } from 'react-router-dom';

// Assets
import backgroundImage from '../assets/Fond_urbain.jpg';
import { ReactComponent as Profil } from '../assets/Profil.svg';
import { ReactComponent as Messagerie } from '../assets/icon_messagerie.svg';
import { ReactComponent as Trajet } from '../assets/icon_trajet.svg';
import marker_1 from '../assets/map-marker-icon-1.png';
import marker_2 from '../assets/map-marker-icon-2.png';
import marker_dynamic from '../assets/map-marker-icon-dynamic.png';
import marker_dynamic_2 from '../assets/map-marker-icon-dynamic-2.png';

// Components
import Footer from '../components/Footer';
import ListRoute from '../components/ListRoute';
import { MatchList } from '../components/MatchList';

// Helper Functions
import { getShortestPath, updateIndex, findMatches } from '../helper/mapHelper';
import { updateRoute, deleteRoute } from '../helper/routeHelper';

// Leaflet (OpenStreetMap) Integration
import { MapContainer, TileLayer, useMapEvents, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Html
export default function NvxTrajet() {
  /**
   * Flag indicating whether this is the first selection of a point.
   * @type {React.MutableRefObject<boolean>}
   */
  const firstSelection = useRef(true);

  /**
   * Whether the start point is currently selected.
   * @type {boolean}
   */
  const [isStartPointSelected, setIsStartPointSelected] = useState(true);

  /**
   * Whether the path should be updated.
   * @type {boolean}
   */
  const [shouldUpdatePath, setShouldUpdatePath] = useState(false);

  /**
   * Whether a drag-end event is currently occurring.
   * @type {boolean}
   */
  const [isDragEndEvent, setIsDragEndEvent] = useState(false);

  
  /**
   * The starting point coordinates.
   * @type {Object|null}
   */
  const [startPoint, setStartPoint] = useState(null);

  /**
   * The ending point coordinates.
   * @type {Object|null}
   */
  const [endPoint, setEndPoint] = useState(null);

  /**
   * A list of intermediate points for the path.
   * @type {Array<Object>}
   */
  const [intermediatePoints, setIntermediatePoints] = useState([]);

  /**
   * A list of received path points from the server.
   * @type {Array<Object>}
   */
  const [receivedPoints, setReceivedPoints] = useState([]);


  /**
   * Reference to check if a route is selected.
   * @type {React.MutableRefObject<boolean>}
   */
    const isRouteSelected = useRef(false);

  /**
   * Represents the selected route.
   * @type {Object|null}
   */
  const [selectedRoute, setSelectedRoute] = useState(null);

  /**
   * Tracks selection updates.
   * @type {boolean}
   */
  const [selectionUpdate, setSelectionUpdate] = useState(false);

  /**
   * Flag to refresh routes or components.
   * @type {boolean}
   */
  const [refresh, setRefresh] = useState(false);
  
  /**
   * ID of the selected matching route.
   * @type {number}
   */
  const [macthingRouteSelectedId, setMacthingRouteSelectedId] = useState(0);

  /**
   * List of matching routes found.
   * @type {Array<Object>}
   */
  const [matchingRoutes, setMatchingRoutes] = useState([]);

  /**
   * Map styling options for blue areas.
   * @type {Object}
   */
  const blueOptions = { fillColor: 'blue' }

  // Route details
  const [routeName, setRouteName] = useState('');
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedPeriodicTimes, setSelectedPeriodicTimes] = useState([]);
  const [routeSelected, setRouteSelected] = useState(false);

  // route similarities
  const [similarities, setSimilarities] = useState([]);
    
/**
 * Updates the path after verifying start and end points, formatting intermediate points,
 * and fetching the shortest path using external APIs.
 *
 * @param {Object} values - The input values (not utilized directly in this function).
 */
  const handlePathSubmit = async (values) => {

    // verify that the starting point and the arrival point are defined
    if (!startPoint || !endPoint) return;

    // formate the points
    const formatedPoints = [startPoint, ...intermediatePoints.map(point => point.latlng) ,endPoint];
    // Handle form submission, e.g., call getShortestPath
    const getPathPromise = getShortestPath(formatedPoints);

    toast.promise(getPathPromise, {
        loading: 'Calcul du trajet...',
        success: <b>Trajet calculé</b>,
        error: <b>Problème lors du calcul du trajet</b>,
    });

    getPathPromise.then((points) => {
      // update the path
      setReceivedPoints(points);
      // if there are intermediate points
      if (intermediatePoints.length > 0) {
        // update the list of intermediate points 
        const updatedIntermediatePoints = updateIndex(points, [...intermediatePoints]);
        updatedIntermediatePoints.then((res) => {  
          setIntermediatePoints(res);
        }).catch((error) => {"Problème lors de la mise à jour du trajet"});
      }
    }).catch((error) => {"Problème lors de l'acquisition du trajet"});
  }

  /**
   * Updates the path dynamically when modifying points.
   */
  useEffect(() => {
    // not calculate the path if a route is selected
    if (isRouteSelected.current === true) return;
    // allow to avoid the first call of the function
    if (firstSelection.current) return;
    // if the update of the path is not allowed, return
    if (!shouldUpdatePath) return;

    // updtae the path
    handlePathSubmit();
    // disable the update of the path
    setShouldUpdatePath(false);
  },
  // call the function when a point is modified
  [startPoint, endPoint, intermediatePoints]);

  /**
   * Map click handler to manage user clicks and drag events.
   * @returns {null} Does not render any component.
   */
  function MapClickHandler() {
    useMapEvents({
      click: (event) => {
        // avoid multiple calls of the function handleMapClick when dragend event is triggered
        if (isDragEndEvent) {
          // reset the drag end event flag
          setIsDragEndEvent(false);
          return;
        }
        // reset the list of intermediate points
        setIntermediatePoints([]);
        // handle the click
        handleMapClick(event, isStartPointSelected);
      },
    });
    // No element to render here
    return null;
  }

  /**
   * Handle map clicks to set start or end points.
   * @param {Object} event Event object containing latitude and longitude.
   * @param {boolean} isStart Determines if the click sets the starting point.
   */
  const handleMapClick = (event, isStart) => {

    // ergonomics operations for the first selection
    if (firstSelection.current) {
      firstSelection.current = false;
      // change the selection of the point (start or end)
      setIsStartPointSelected(!isStartPointSelected)
    } else {
      // update the selection of the point (start or end)
      setIsStartPointSelected(isStart);
    }

    const { latlng } = event;
    // set the starting point or the arrival point
    if (isStart) {
      setStartPoint(latlng)
    } else {
      setEndPoint(latlng)
    }
    // enable the update of the path
    setShouldUpdatePath(true);
  };

  /**
   * Handle drag-end events and reformat them for processing.
   * @param {Object} event Drag event object.
   * @param {boolean} isStart Indicates if the point dragged is the starting point.
   */
  function handleDragEnd(event, isStart) {
    // set the drag end event flag
    setIsDragEndEvent(true);
    // reformat the event
    const e = { latlng: event.target._latlng };
    // change the arrival point 
    handleMapClick(e, isStart);
  }

  // -------------- CreateRoute.js && ListRoute.js --------------

  /**
   * Format the route into a structure suitable for the server.
   * @param {Object} formData Data from the form submission.
   * @param {Array<Object>} points Array of points along the route.
   * @returns {Object|null} Formatted route data or null.
   */
  function formatRoute(formData, points) {
    // verify the existence of the route
    if (!points || points.length === 0) {
      toast.error('Veuillez créer un chemin');
      return null;
    }
    // transform the points to a JSON format
    const transformedPoints = points.map(point => {
      const [lng, lat] = point;
      return JSON.stringify([lat, lng]);
    });
    // Add the path to the form data
    formData.route = transformedPoints;
    return formData;
  };

/**
 * Handles the deletion of a route by formatting the data and sending it to the server.
 * Displays toast notifications for loading, success, and error states.
 * @param {string} routeName - The name of the route to be deleted.
 */
  const handleDeleteRoute = (routeName) => {
    // delete the route from the server
    const deleteRoutePromise = deleteRoute(routeName);

    toast.promise(deleteRoutePromise, {
      loading: 'Suppression du trajet...',
      success: <b>Trajet supprimé</b>,
      error: <b>Problème lors de la suppression du trajet</b>,
    });

    deleteRoutePromise.then(() => {
      // update the list of routes
      setRefresh(!refresh);
    }).catch((error) => {"Problème lors de la mise à jour de la liste des trajets"});
  }

  /**
   * Submits the form and updates the route if the information is valid.
   *
   * @param {Event} e - The form submission event.
  */
  const handleUpdateRoute1 = (e) => {
    e.preventDefault();
    // Verify that all the required information is filled
    const routeInfos = getValideRouteInfos();
    if (routeInfos) {
      // If the conditions are met, submit the form
      handleUpdateRoute2(routeInfos);
    }
  };

  /**
   * Handles the update of a route by formatting the data and sending it to the server.
   *
   * @param {Object} formData - The form data containing route details.
 */
  const handleUpdateRoute2 = (formData) => {
    // format the data for the server
    const data = formatRoute(formData, receivedPoints);
    // add the route to the server
    const updateRoutePromise = updateRoute(data);

    toast.promise(updateRoutePromise, {
      loading: 'Mise à jour du trajet...',
      success: <b>Route mise à jour</b>,
      error: (err) => <b>{err.response.data.error}</b>,
    });

    updateRoutePromise.then(() => {
      // update the list of routes
      setRefresh(!refresh);
    }).catch((error) => {"Problème lors de la mise à jour de la liste des trajets"});
  };

  /**
   * Updates the displayed information when a route is selected.
   *
   * @param {Object} route - The selected route object.
 */
  const handleSelectMyRoute = (route) => {
    setRouteSelected(true);
    // disable the first selection flag
    firstSelection.current = false;
    // set the flag to true
    isRouteSelected.current = true;
    // transform the points to a list of points [lat, lng]
    const transformedPoints = route.route.map(point => {
      const [lng, lat] = JSON.parse(point);
      return [lat, lng];
    });
    // update the path
    setReceivedPoints(transformedPoints);
    // get the starting point and the arrival point
    const startPoint = transformedPoints[0];
    const endPoint = transformedPoints[transformedPoints.length - 1];
    // transform the points to a JSON format
    const formatedStartPoint = { "lat": startPoint[0], "lng": startPoint[1]};
    const formatedEndPoint = {"lat": endPoint[0], "lng": endPoint[1]};
    // update the starting point and the arrival point
    setStartPoint(formatedStartPoint);
    setEndPoint(formatedEndPoint);
    // update the selected route
    setSelectedRoute(route);
    isRouteSelected.current = false;
    setSelectionUpdate(!selectionUpdate);
  };

  /**
   * Updates the displayed information when a matching route is selected by ID.
   *
   * @param {string} id - The ID of the selected matching route.
 */
  const handleSelecMatchingRoute = (id) => {
    setMacthingRouteSelectedId(id);
  };

  // ----------------------- MatchList.js -----------------------

  /**
   * Verifies that a route has valid information before processing.
   *
   * @param {Object} route - The route object to validate.
   * @returns {Object|undefined} - Valid route information or undefined if invalid.
 */
  function getValideRouteInfos(route) {
    // Verify that the name is filled
    if (!selectedRoute.name.trim()) {
      toast.error('Veuillez entrer un nom pour le chemin.');
      return;
    }
    // Verify that at least one date OR one periodic time is selected
    if (selectedRoute.planning.dates.length === 0 && selectedRoute.planning.periodic.length === 0) {
      toast.error('Veuillez sélectionner au moins une date ou un horaire périodique.');
      return;
    }
    // structure the route information
    const routeInfos = { 
      "name": routeName, 
      "planning": { 
        "dates": selectedDates, 
        "periodic": selectedPeriodicTimes 
      }
    }
    return routeInfos;
  }

  /**
   * Finds matches for a route and updates the matching route list.
   *
   * @param {Object} formData - The form data containing route details.
 */
  const handleFindMatches = (formData) => {
    // Format the data for the server
    const data = formatRoute(formData, receivedPoints);

    if (!data) return;

    // Add the route to the server
    const findMatchesPromise = findMatches(data);

    toast.promise(findMatchesPromise, {
      loading: 'Recherche de trajets...',
      success: <b>Trajets récupérés</b>,
      error: (err) => <b>{err.response.data.error}</b>,
    });

    findMatchesPromise.then(({ routes, similarities }) => {
      // Transform the points to a list of points [lat, lng]
      const formattedData = routes.map((route, id) => {
        let points = route.route;
        const transformedPoints = points.map(point => {
          const [lng, lat] = JSON.parse(point);
          return [lat, lng];
        });
        let formattedRoute = route;
        formattedRoute.route = transformedPoints;
        return formattedRoute;
      });

      setMatchingRoutes(formattedData);
      console.log('Similarities:', similarities);
      setSimilarities(similarities);
      // update the list of routes
      // setRefresh(!refresh);
    }).catch((error) => { console.log("Pas de trajets similaires") });
  };

  /**
   * Handles button click to find matching routes after validation.
 */
  const handleFindMatchesBtn = () => {
    // Verify that all the required information is filled
    const routeInfos = getValideRouteInfos();
    if (routeInfos) {
      // If the conditions are met, submit the form
      handleFindMatches(routeInfos);
    }
  }

  /**
   * Updates the form fields when a route is selected or modified.
 */
  useEffect(() => {
    // if no route is selected, return
    if (!selectedRoute) return;
    // update the name of the route
    setRouteName(selectedRoute.name);
    // update the selected dates
    setSelectedDates(selectedRoute.planning.dates);
    // update the selected periodic times
    setSelectedPeriodicTimes(selectedRoute.planning.periodic);
  }, [selectedRoute, selectionUpdate]);

  return (
    <div>
      <Toaster position="" reverseOrder={false}></Toaster>
      <div className='backgroundImage' style={{backgroundImage: `url(${backgroundImage})`}}>

          {/* Navigation Bar */}
          <nav class="navbar d-flex justify-content-end p-2 float-end">
              <Link class="border border-4 border-success rounded-3 mx-1 mt-2" to="/nvxtrajet">
                  <Trajet style={{ width: '100px', height: '100px' }} alt='commencer'/>
              </Link>
              <Link class="border border-2 border-dark rounded-3 mx-1 mt-2" to="/chat">
                  <Messagerie style={{ width: '100px', height: '100px' }} alt='commencer'/>
              </Link>
              <Link class="border border-2 border-dark rounded-3 mx-1 mt-2" to="/profile">
                  <Profil style={{ width: '100px', height: '100px' }} alt='commencer'/>
              </Link>
          </nav>

          <div class="p-4 mb-4">
            <div>
              <h1 class="fw-bold text-large">Covelotage</h1>
              <h2 >Votre Communaute Cycliste</h2>
            </div>
          </div>

          <div class="light-gray rounded-3 p-4 mx-auto my-3 mx-md-5 my-md-4" >
              <div class="row">
                {/*<!-- Left Column: ListRoute -->*/}
                <div class="col-md-5">
                  <ListRoute refresh={refresh} onSelectRoute={handleSelectMyRoute} deleteRoute={handleDeleteRoute} />
                </div>
                {/*<!-- Right Column: MatchList -->*/}
                <div class="col-md-7">
                  {true && (
                    <MatchList routes={matchingRoutes} onSelectMatchingRoute={handleSelecMatchingRoute} similarities={similarities}/>
                  )}
                </div>
                <div>
                  <button class='event-button mt-2' id="findMatchesBtn" onClick={handleFindMatchesBtn} style={{display: routeSelected ? 'block' : 'none' }}>
                    TROUVER UN COVELOTEUR !
                  </button>
                </div>
                <div>
                  {selectedRoute && (
                    <button class='event-button mt-2' id="findMatchesBtn" onClick={handleUpdateRoute1} style={{display: routeSelected ? 'block' : 'none' }}>
                      Modifier le trajet
                    </button>
                  )}
                </div>
              </div>

              <div class="d-flex flex-column align-items-center">
                <h2 class='me-5 my-3' style = {{color: '#4F772D'}}>Carte</h2>
                <MapContainer
                    center={[48.65, 6.15]}
                    zoom={17}
                    style={{
                        border: '4px solid #414833',
                        height: '50vw',
                        width: '50vw',
                        position: 'relative',
                    }}
                    >
                      
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />

                    { /** Starting point */
                        startPoint && (
                        <Marker
                            position={[startPoint.lat, startPoint.lng]}
                            //altitude={[startPoint.altitude, startPoint.altitude]}
                            icon={L.icon({ iconUrl: marker_1, iconSize: [40, 40] })}
                            draggable={true}
                            eventHandlers={{
                            dragend: (event) => { handleDragEnd(event, true) }
                            }}
                        >          
                        </Marker>
                    )}

                    { /** End point */
                        endPoint && (
                        <Marker
                            position={[endPoint.lat, endPoint.lng]}
                            icon={L.icon({ iconUrl: marker_2, iconSize: [40, 40] })}
                            draggable={true}
                            eventHandlers={{
                            dragend: (event) => { handleDragEnd(event, false) }
                            }}
                        >
                        </Marker>
                    )}

                    {/** Matching routes */
                    matchingRoutes.length > 0 &&
                        matchingRoutes[macthingRouteSelectedId].route.map((point, index) => (
                            (<Marker 
                            key={index}
                            position={point}
                            icon={L.icon({ iconUrl: marker_dynamic_2, iconSize: [20, 20] })}
                            >
                            </Marker>)
                        ))       
                    }

                    {/** Path */
                    matchingRoutes.length > 0 && (
                        <Polyline color='green' positions={[matchingRoutes[macthingRouteSelectedId].route]} />
                    )}

                    {/** Path */
                    receivedPoints && (
                        <Polyline pathOptions={blueOptions} positions={[receivedPoints]} />
                    )}
                    
                    {/** Dynamics points */
                      receivedPoints.map((point, index) => (
                      <Marker 
                      key={index}
                      position={point}
                      icon={L.icon({ iconUrl: marker_dynamic, iconSize: [10, 10] })}
                      // draggable only if not start or end point
                      draggable={(index !== 0) && (index !== receivedPoints.length - 1)}
                      
                      eventHandlers={{
                          dragend: (event) => {
                          // set the drag end event flag
                          setIsDragEndEvent(true);

                          // reformat the event
                          const modifiedPoint = {
                              latlng: event.target._latlng,
                              index: index,
                          };

                          // retrieve the list of points previously moved manually
                          const points = [...intermediatePoints];
                                          
                          // Check if the index already exists.
                          const existingIndex = points.findIndex(
                              (point) => point.index === index
                          );

                          // update the temporary list
                          if (existingIndex !== -1) {
                              // update the existing point
                              points[existingIndex] = modifiedPoint;
                          } else {
                              // add the new point
                              points.push(modifiedPoint);
                              // sort the list of points
                              points.sort((a, b) => a.index - b.index);
                          }

                          // update the list of intermediate points
                          setIntermediatePoints(points);
                          // enable the update of the path
                          setShouldUpdatePath(true);                
                          }
                        }}
                        >
                        { false && (<Popup>Point dynamique {index + 1} // lat {point}</Popup>)}
                        </Marker>
                    ))}
                    <MapClickHandler />
                </MapContainer>
              </div>
              
          </div>
      </div>
      <Footer/>
    </div>
  );
}
  