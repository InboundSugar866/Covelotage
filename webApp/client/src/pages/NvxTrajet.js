import React, { useState, useRef, useEffect} from 'react';
import toast, {Toaster} from 'react-hot-toast';
import { Link } from 'react-router-dom'

import backgroundImage from '../assets/Fond_urbain1.jpg';
import Footer from '../components/Footer';
import { ReactComponent as Profil } from '../assets/Profil.svg';
import { ReactComponent as Messagerie } from '../assets/icon_messagerie.svg';
import { ReactComponent as Trajet } from '../assets/icon_trajet.svg';

import { getShortestPath, updateIndex, findMatches } from '../helper/mapHelper';
import { addRouteToServer, updateRoute, deleteRoute } from '../helper/routeHelper';

import ListRoute from '../components/ListRoute';
import { MatchList } from '../components/MatchList';

import '../styles/NvxTrajet.css';

/** Display OpenSteetMap with leaflet module */
import { MapContainer, TileLayer, useMapEvents, Marker, Popup, Polyline} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import marker_1 from '../assets/map-marker-icon-1.png';
import marker_2 from '../assets/map-marker-icon-2.png';
import marker_dynamic from '../assets/map-marker-icon-dynamic.png';
import marker_dynamic_2 from '../assets/map-marker-icon-dynamic-2.png';


import { CreateRoute } from '../components/CreateRoute';



export default function NvxTrajet() {

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
  const [selectedRoute, setSelectedRoute] = useState(null);
  // enables updating the displayed information when the same route is re-selected.
  const [selectionUpdate, setSelectionUpdate] = useState(false);
  // refresh the list of routes
  const [refresh, setRefresh] = useState(false);
  
  //  id of the selected matching route
  const [macthingRouteSelectedId, setMacthingRouteSelectedId] = useState(0);
  // matching routes 
  const [matchingRoutes, setMatchingRoutes] = useState([]);

  // Path color
  const blueOptions = { fillColor: 'blue' }

  const [routeName, setRouteName] = useState('');
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const [selectedPeriodicTimes, setSelectedPeriodicTimes] = useState([]);
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState(0);
  const [selectedTime, setSelectedTime] = useState(null);

  // state to store the list of routes
  const [routes, setRoutes] = useState([]);

  
  /** Updates the path */
  const handlePathSubmit = async (values) => {

    // verify that the starting point and the arrival point are defined
    if (!startPoint || !endPoint) return;

    // formate the points
    const formatedPoints = [startPoint, ...intermediatePoints.map(point => point.latlng) ,endPoint];
    // Handle form submission, e.g., call getShortestPath
    const getPathPromise = getShortestPath(formatedPoints);

    toast.promise(getPathPromise, {
        loading: 'Calculating path...',
        success: <b>Path calculated</b>,
        error: <b>Path calculation failed</b>,
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
        }).catch((error) => {"fail to update the index of the intermediate points"});
      }
    }).catch((error) => {"fail to get the path from the server"});
  }

   /** Updates the path when modifying points of the path */
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

  /** Use the useMapEvents function to handle map events */
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

  /** Handle map click (set startPoint and EndPoint) */
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

  // Format the route for the server
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

  // Handle the deletion of a route
  const handleDeleteRoute = (routeName) => {
    // delete the route from the server
    const deleteRoutePromise = deleteRoute(routeName);

    toast.promise(deleteRoutePromise, {
      loading: 'Deleting route...',
      success: <b>Route deleted</b>,
      error: <b>Fail to delete the route</b>,
    });

    deleteRoutePromise.then(() => {
      // update the list of routes
      setRefresh(!refresh);
    }).catch((error) => {"fail to update the list of routes"});
  }

  // Handle the creation of a route
  const handleCreateRoute = (formData) => {

    // format the data for the server
    const data = formatRoute(formData, receivedPoints);
    if (!data) return;
    // add the route to the server
    const addRoutePromise = addRouteToServer(data);

    toast.promise(addRoutePromise, {
      loading: 'Adding route...',
      success: <b>Route added</b>,
      error: (err) => <b>{err.response.data.error}</b>,
    });

    addRoutePromise.then(() => {
      // update the list of routes
      setRefresh(!refresh);
    }).catch((error) => {"fail to update the list of routes"});
  };

  // Handle the update of a route
  const handleUpdateRoute = (formData) => {

    // format the data for the server
    const data = formatRoute(formData, receivedPoints);
    // add the route to the server
    const updateRoutePromise = updateRoute(data);

    toast.promise(updateRoutePromise, {
      loading: 'Updating route...',
      success: <b>Route Mmise à jour</b>,
      error: (err) => <b>{err.response.data.error}</b>,
    });

    updateRoutePromise.then(() => {
      // update the list of routes
      setRefresh(!refresh);
    }).catch((error) => {"fail to update the list of routes"});
  };

  // Update innfomations displayed when a route is selected
  const handleSelectMyRoute = (route) => {
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


   // Update innfomations displayed when a route is selected
   const handleSelecMatchingRoute = (id) => {
    setMacthingRouteSelectedId(id);
  };


  // ----------------------- MatchList.js -----------------------

  function getValideRouteInfos() {
    /*
    routes.map((route, index) => (
      console.log(route.name);
    ));
*/

    // Verify that the name is filled
    if (!routeName.trim()) {
      toast.error('Veuillez entrer un nom pour le chemin.');
      return;
    }
    // Verify that at least one date OR one periodic time is selected
    if (selectedDates.length === 0 && selectedPeriodicTimes.length === 0) {
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
    console.log('routeInfos', routeInfos);
    return routeInfos;
  }

  // Handle the update of a route
  const handleFindMatches = (formData) => {
    
    // format the data for the server
    const data = formatRoute(formData, receivedPoints);
    console.log('formData : ', formData);

    if (!data) return;
    // add the route to the server
    const findMatchesPromise = findMatches(data);

    toast.promise(findMatchesPromise, {
      loading: 'Findings routes...',
      success: <b>Trajets récupérés</b>,
      error: (err) => <b>{err.response.data.error}</b>,
    });

    findMatchesPromise.then((formData) => {

      // transform the points to a list of points [lat, lng]
      const formatedData = formData.map((route, id) => {
        console.log(route);
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
    }).catch((error) => {"fail to get matching routes"});
  };

    // find matches for a route button
    const handleFindMatchesBtn = () => {
      // Verify that all the required information is filled
      const routeInfos = getValideRouteInfos();
      if (routeInfos) {
        // If the conditions are met, submit the form
        handleFindMatches(routeInfos);
      }
      console.log('handleFindMatchesBtn OK');
    }
/*
  // for the adress search
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

  // Function to place a marker based on address
  const handleSearch = _.debounce(async (address, isStartPoint) => {
    // Check cache first
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
          // Store results in cache
          searchCache[address] = results;
          if (isStartPoint) {
            setStartAddressSuggestions(results);
          } else {
            setEndAddressSuggestions(results);
          }
        }
      } catch (error) {
        if (error.message === 'Failed to fetch') {
          toast.error('Network error: Failed to fetch');
        }
        else {
          toast.error(`Unexpected error: ${error.message}`);
        }
      }
    }
  }, 500); // Debounce time (ms)
  
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
      toast.error("error");
    }
  };*/


    return (
    <div className='general'>
        <Toaster position="" reverseOrder={false}></Toaster>
        <div className='backgroundImage' style={{backgroundImage: `url(${backgroundImage})`}}>

            {/* Navigation Bar */}
            <nav className="navbar">
                <Link className="navutil" to="/map">
                    <Trajet style={{ width: '100px', height: '100px' }} alt='commencer'/>
                </Link>
                <Link className="navutil" to="/chat">
                    <Messagerie style={{ width: '100px', height: '100px' }} alt='commencer'/>
                </Link>
                <Link className="navutil" to="/profile">
                    <Profil style={{ width: '100px', height: '100px' }} alt='commencer'/>
                </Link>
            </nav>



            <div className='container-carte-trajet' >

                {/* Intégrez le composant ListRouteForm */}
                <ListRoute refresh={refresh} onSelectRoute={handleSelectMyRoute} deleteRoute={handleDeleteRoute}/>

                <button onClick={handleFindMatchesBtn}>
                  Trouver les correspondances
                </button>

                {/* Intégrez le composant MatchList */}
                { true && (
                    <MatchList routes={matchingRoutes} handleFindMatches={handleFindMatches} onSelectMatchingRoute={handleSelecMatchingRoute}/>
                )}

                <div>
                <MapContainer
                    center={[48.65, 6.15]}
                    zoom={17}
                    style={{
                        border: '1px solid #ccc',
                        height: '700px',
                        width: '700px',
                        margin: '10px',
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
                <Link to="/map"><button>Retour</button></Link>
                </div>
                
            </div>
        </div>
        <Footer/>
      </div>
  
    );
  }
  