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


        {/* Intégrez le composant ListRouteForm */}
        <ListRoute refresh={refresh} onSelectRoute={handleSelectMyRoute} deleteRoute={handleDeleteRoute}/>

          {/* Intégrez le composant MatchList */}
          { true && (
            <MatchList routes={matchingRoutes} handleFindMatches={handleFindMatches} onSelectMatchingRoute={handleSelecMatchingRoute}/>
          )}

        <Link to="/map"><button>Retour</button></Link>

      </div>
      <Footer/>
      </div>
  
    );
  }
  