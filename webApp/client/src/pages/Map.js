/**
 * @fileOverview This file contains the Map component for the Covelotage application.
 * It integrates Leaflet for map interactions and routing functionalities.
 * The component allows users to select start and end points, add intermediate points,
 * and dynamically update the path. It also includes functionalities for creating,
 * updating, and finding matching routes, with visual feedback using toast notifications.
 * The component uses various helper functions and components to manage map interactions,
 * route handling, and address searches.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

// Helper Functions
import { getShortestPath, updateIndex, findMatches } from '../helper/mapHelper';
import { addRouteToServer, updateRoute } from '../helper/routeHelper';

// Components
import { LogoutButton } from '../components/LogoutButton';
import { CreateRoute } from '../components/CreateRoute';
import Footer from '../components/Footer';

// Leaflet (OpenStreetMap) Integration
import { MapContainer, TileLayer, useMapEvents, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { Tooltip } from 'react-leaflet';

// Assets
import marker_1 from '../assets/map-marker-icon-1.png';
import marker_2 from '../assets/map-marker-icon-2.png';
import marker_dynamic_2 from '../assets/map-marker-icon-dynamic-2.png';
import backgroundImage from '../assets/Fond_urbain.jpg';
import { ReactComponent as Profil } from '../assets/Profil.svg';
import { ReactComponent as Messagerie } from '../assets/icon_messagerie.svg';
import { ReactComponent as Trajet } from '../assets/icon_trajet.svg';

// Utility Library
import _ from 'lodash';

/**
 * Represents a Map component that manages map interactions and routing.
 */
export default function Map() {

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
  const [selectedRoute] = useState(null);

  /**
   * Tracks selection updates.
   * @type {boolean}
   */
  const [selectionUpdate] = useState(false);

  /**
   * Flag to refresh routes or components.
   * @type {boolean}
   */
  const [refresh, setRefresh] = useState(false);
  
  /**
   * ID of the selected matching route.
   * @type {number}
   */
  const [macthingRouteSelectedId] = useState(0);

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
    }).catch((error) => {"Problème lors de la récupération du trajet"});
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
 * Handles the creation of a route by formatting the data and sending it to the server.
 * Displays toast notifications for loading, success, and error states.
 * @param {Object} formData - The data collected from the form submission.
 */
const handleCreateRoute = (formData) => {
  // format the data for the server
  const data = formatRoute(formData, receivedPoints);
  if (!data) return;
  // add the route to the server
  const addRoutePromise = addRouteToServer(data);

  toast.promise(addRoutePromise, {
    loading: 'Ajout du trajet...',
    success: <b>Trajet ajouté</b>,
    error: (err) => <b>{err.response.data.error}</b>,
  });

  addRoutePromise.then(() => {
    // update the list of routes
    setRefresh(!refresh);
  }).catch((error) => {
    "Problème lors de la création du trajet";
  });
};

/**
 * Handles the update of a route by formatting the data and sending it to the server.
 * Displays toast notifications for loading, success, and error states.
 * @param {Object} formData - The data collected from the form submission.
 */
const handleUpdateRoute = (formData) => {
  // format the data for the server
  const data = formatRoute(formData, receivedPoints);
  // add the route to the server
  const updateRoutePromise = updateRoute(data);

  toast.promise(updateRoutePromise, {
    loading: 'Mise à jour du trajet...',
    success: <b>Trajet mise à jour</b>,
    error: (err) => <b>{err.response.data.error}</b>,
  });

  updateRoutePromise.then(() => {
    // update the list of routes
    setRefresh(!refresh);
  }).catch((error) => {
    "Problème lors de la mise à jour du trajet";
  });
};

/**
 * Finds matching routes by formatting the data and querying the server.
 * Transforms the returned data and updates the state with the matching routes.
 * Displays toast notifications for loading, success, and error states.
 * @param {Object} formData - The data collected from the form submission.
 */
const handleFindMatches = (formData) => {
  // format the data for the server
  const data = formatRoute(formData, receivedPoints);
  if (!data) return;
  // add the route to the server
  const findMatchesPromise = findMatches(data);

  toast.promise(findMatchesPromise, {
    loading: 'Recherche de trajets corresspondants...',
    success: <b>Trajets récupérés</b>,
    error: (err) => <b>{err.response.data.error}</b>,
  });

  findMatchesPromise.then((formData) => {
    // transform the points to a list of points [lat, lng]
    const formatedData = formData.map((route, id) => {
      let points = route.route;
      const transformedPoints = points.map(point => {
        const [lng, lat] = JSON.parse(point);
        return [lat, lng];
      });
      let formattedRoute = route;
      formattedRoute.route = transformedPoints;
      return formattedRoute;
    });

    setMatchingRoutes(formatedData);
  }).catch((error) => {
    "Problème lors de la récupération des trajets corresspondants";
  });
};


  /* for the adress search */
  const [startAddress, setStartAddress] = useState('');
  const [endAddress, setEndAddress] = useState('');
  const [startAddressSuggestions, setStartAddressSuggestions] = useState([]);
  const [endAddressSuggestions, setEndAddressSuggestions] = useState([]);
  //const provider = new OpenStreetMapProvider();
  const provider = new OpenStreetMapProvider({
    params: {
      'accept-language': 'fr', // render results in Dutch
      countrycodes: 'fr', // limit search results to the Netherlands
      addressdetails: 1, // include additional address detail parts
      limit: 10, // limit the number of results
    },
  });

  // Cache for search results
  const searchCache = {};

  /**
   * Handles address searches using debounce to optimize performance.
   * @param {string} address Address to search for.
   * @param {boolean} isStartPoint Indicates if the search is for the starting point.
   */
  const handleSearch = _.debounce(async (address, isStartPoint) => {
    if (searchCache[address]) {
      if (isStartPoint) {
        setStartAddressSuggestions(searchCache[address]);
      } else {
        setEndAddressSuggestions(searchCache[address]);
      }
    } else {
      try {
        const results = await provider.search({ query: address });
        if (results.length > 0) {
          const formattedResults = results.map(result => {
            const parts = result.label.split(', ');
            const formattedLabel = parts.slice(0, 3).join(', '); // Customize this line to show only the first three parts
            return {
              label: formattedLabel,
              x: result.x,
              y: result.y
            };
          });
          searchCache[address] = formattedResults;
          if (isStartPoint) {
            setStartAddressSuggestions(formattedResults);
          } else {
            setEndAddressSuggestions(formattedResults);
          }
        } else {
          if (isStartPoint) {
            setStartAddressSuggestions([{ label: 'Pas de résultats trouvés' }]);
          } else {
            setEndAddressSuggestions([{ label: 'Pas de résultats trouvés' }]);
          }
        }
      } catch (error) {
        toast.error(`Erreur : ${error.message}`);
      }
    }
  }, 500);

  /**
   * Handles user click on address suggestions to set markers.
   * @param {Object} suggestion Address suggestion data.
   * @param {boolean} isStartPoint Determines if the suggestion sets the starting point.
   */
  const handleSuggestionClick = (suggestion, isStartPoint) => {
    try {
      const { x: lng, y: lat } = suggestion;
      if (isStartPoint) {
        setStartPoint({ lat, lng });
        setStartAddress(suggestion.label);
        // Update the start point in the receivedPoints array
        setReceivedPoints(prevPoints => {
          const newPoints = [...prevPoints];
          newPoints[0] = { lat, lng };
          return newPoints;
        });
      } else {
        setEndPoint({ lat, lng });
        setEndAddress(suggestion.label);
        // Update the end point in the receivedPoints array
        setReceivedPoints(prevPoints => {
          const newPoints = [...prevPoints];
          newPoints[newPoints.length - 1] = { lat, lng };
          return newPoints;
        });
        handlePathSubmit();
      }
    }
    catch (error) {
      toast.error(`Erreur : ${error.message}`);
    }
  };

  return (
    <div>
      <Toaster position='top-center' reverseOrder={false}></Toaster>
      <div className='backgroundImage' style={{backgroundImage: `url(${backgroundImage})`}}>
            {/* Navigation Bar */}
            <nav class="navbar d-flex justify-content-end p-2 float-end">
                <Link class="nav-link border border-2 border-dark rounded-3 mx-1 mt-2" to="/nvxtrajet">
                    <Trajet style={{ width: '100px', height: '100px' }} alt='commencer'/>
                </Link>
                <Link class="nav-link border border-2 border-dark rounded-3 mx-1 mt-2" to="/chat">
                    <Messagerie style={{ width: '100px', height: '100px' }} alt='commencer'/>
                </Link>
                <Link class="nav-link border border-2 border-dark rounded-3 mx-1 mt-2" to="/profile">
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

          {/** Display the form above the map */}
          <div style={{ position: 'relative', zIndex : 1001 }}>
            {/* Formulaire pour le nom du chemin et la planification */}
            <CreateRoute 
              createRoute={handleCreateRoute} 
              selectedRoute={selectedRoute} 
              selectionUpdate={selectionUpdate}
              updateRoute={handleUpdateRoute}
              handleFindMatches={handleFindMatches}

              startAddress={startAddress}
              setStartAddress={setStartAddress}
              endAddress={endAddress}
              setEndAddress={setEndAddress}
              startAddressSuggestions={startAddressSuggestions}
              endAddressSuggestions={endAddressSuggestions}
              handleSearch={handleSearch}
              handleSuggestionClick={handleSuggestionClick}

              handlePathSubmit={handlePathSubmit}
            />
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
                    <Tooltip className="custom-tooltip">
                      Vous pouvez déplacer le point en le faisant glisser.
                    </Tooltip>
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
                    <Tooltip className="custom-tooltip">
                      Vous pouvez déplacer le point en le faisant glisser.
                    </Tooltip>
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
                <Polyline color='green' positions={[matchingRoutes[macthingRouteSelectedId].route]}/>
              )}

              {/** Path */
              receivedPoints && (
                <Polyline pathOptions={blueOptions} positions={[receivedPoints]}>
                  <Tooltip sticky className="custom-tooltip">
                    Vous pourrez modifier le chemin une fois le trajet créé.
                  </Tooltip>
                </Polyline>

              )}

              <MapClickHandler />
            </MapContainer>
          </div>
          <Link to="/NvxTrajet" style={{color:'#414833'}}>Retour</Link>
          <LogoutButton />
        </div>
      </div>
      <Footer/>
    </div>
  );
};