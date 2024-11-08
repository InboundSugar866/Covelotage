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

// Html
export default function Map() {

  // ergonomics variable for the first selection
  const firstSelection = useRef(true);
  // Manage the behavior of the starting and arrival points
  const [isStartPointSelected, setIsStartPointSelected] = useState(true);
  // allow to avoid multiple calls of the function handlePathSubmit
  const [shouldUpdatePath, setShouldUpdatePath] = useState(false);
  // prevent the mutilple calls of the function handleMapClick
  const [isDragEndEvent, setIsDragEndEvent] = useState(false);
  
  // starting point and arrival point
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  // points manually modified by the user
  const [intermediatePoints, setIntermediatePoints] = useState([]);

  // received points from the server
  const [receivedPoints, setReceivedPoints] = useState([]);

  // is a route is selected in the list of my routes
  const isRouteSelected = useRef(false);
  // route selected in the list of my routes
  const [selectedRoute] = useState(null);
  // enables updating the displayed information when the same route is re-selected.
  const [selectionUpdate] = useState(false);
  // refresh the list of routes
  const [refresh, setRefresh] = useState(false);
  
  //  id of the selected matching route
  const [macthingRouteSelectedId] = useState(0);
  // matching routes 
  const [matchingRoutes, setMatchingRoutes] = useState([]);

  // Path color
  const blueOptions = { fillColor: 'blue' }
  
  /* Updates the path */
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

   /* Updates the path when modifying points of the path */
  useEffect(() => {
    console.log("useeffect",firstSelection);
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

  /* Use the useMapEvents function to handle map events */
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

  /* Handle map click (set startPoint and EndPoint) */
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

  function handleDragEnd(event, isStart) {
    // set the drag end event flag
    setIsDragEndEvent(true);
    // reformat the event
    const e = { latlng: event.target._latlng };
    // change the arrival point 
    handleMapClick(e, isStart);
  }

  // -------------- CreateRoute.js && ListRoute.js --------------

  /* Format the route for the server */
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

  /* Handle the creation of a route */
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
    }).catch((error) => {"Problème lors de la création du trajet"});
  };

  /* Handle the update of a route */
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
    }).catch((error) => {"Problème lors de la mise à jour du trajet"});
  };

  // ----------------------- MatchList.js -----------------------

  /* Handle the update of a route */
  const handleFindMatches = (formData) => {
    
    // format the data for the server
    const data = formatRoute(formData, receivedPoints);
    console.log('formData : ', formData);

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
      // update the list of routes
      // setRefresh(!refresh);
    }).catch((error) => {"Problème lors de la récupération des trajets corresspondants"});
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

  /* Function to place a marker based on address */
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

  /* Function to handle the suggestion list */
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
            Vous pourrez modifier le chemin une fois le trajet créé.
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