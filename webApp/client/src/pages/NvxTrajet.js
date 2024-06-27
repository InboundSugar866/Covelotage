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
    
    // starting point and arrival point
    const [startPoint, setStartPoint] = useState(null);
    const [endPoint, setEndPoint] = useState(null);

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

  // Manage the behavior of the starting and arrival points
  const [isStartPointSelected, setIsStartPointSelected] = useState(true);
  // allow to avoid multiple calls of the function handlePathSubmit
  const [shouldUpdatePath, setShouldUpdatePath] = useState(false);
  // prevent the mutilple calls of the function handleMapClick
  const [isDragEndEvent, setIsDragEndEvent] = useState(false);

    // points manually modified by the user
    const [intermediatePoints, setIntermediatePoints] = useState([]);

    // Path color
    const blueOptions = { fillColor: 'blue' }

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

    // Handle the update of a route
    const handleFindMatches = (formData) => {
        console.log('ok');
        
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

    // Update innfomations displayed when a route is selected
    const handleSelecMatchingRoute = (id) => {
        setMacthingRouteSelectedId(id);
    };

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
  