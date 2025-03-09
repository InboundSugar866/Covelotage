// React and Related Hooks
import React, { useState, useEffect } from 'react';

// Helper Functions
import { getAllRoutes, getDayOfWeek } from '../helper/routeHelper';

// Styles
import 'react-datepicker/dist/react-datepicker.css';
import 'rc-time-picker/assets/index.css';
import '../styles/ListRoute.css';

// Router
import { Link } from 'react-router-dom';

// Assets
import { ReactComponent as Emplacement } from '../assets/emplacement.svg';
import { ReactComponent as Horloge } from '../assets/horloge.svg';
import { ReactComponent as Calendrier } from '../assets/calendrier.svg';

/**
 * ListRoute Component
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.refresh - A flag to trigger the refresh of the route list
 * @param {function} props.onSelectRoute - Callback function triggered when a route is selected
 * @param {function} props.deleteRoute - Callback function to delete a route
 * 
 * @returns {JSX.Element} Rendered component
 * 
 * This component displays a list of routes and allows the user to interact with them.
 */
const ListRoute = ({ refresh, onSelectRoute, deleteRoute }) => {
  /**
   * State to store the list of routes
   * @type {Array<Object>}
   */
  const [routes, setRoutes] = useState([]);

  /**
   * State to store the selected route
   * @type {Object|null}
   */
  const [selectedRoute, setSelectedRoute] = useState(null);

  /**
   * Effect hook to refresh the list of routes when `refresh` changes
   */
  useEffect(() => {
      /**
       * Fetches the list of routes from the server
       */
      const fetchRoutes = async () => {
          try {
              const userRoutes = await getAllRoutes();
              // Format periodic times into Date objects
              const routes = userRoutes.map((route) => ({
                  ...route,
                  planning: {
                      ...route.planning,
                      periodic: route.planning.periodic.map((periodic) => ({
                          ...periodic,
                          time: new Date(periodic.time)
                      })),
                      dates: route.planning.dates.map((date) => new Date(date))
                  }
              }));
              setRoutes(routes);
          } catch (error) {
              console.error('Erreur lors du chargement des routes :', error);
          }
      };

      fetchRoutes();
  }, [refresh]);

  /**
   * Handles the click on a route
   * 
   * @param {Object} route - The selected route object
   */
  const handleRouteClick = (route) => {
      setSelectedRoute(route);
      onSelectRoute(route);
  };

  /**
   * Checks if the provided date is valid
   * 
   * @param {any} d - The date to check
   * @returns {boolean} Whether the date is valid
   */
  function isValidDate(d) {
      return d instanceof Date && !isNaN(d);
  }

  return (
    <div>
      <div class="d-flex align-items-center">
        <h2 class='me-5' style = {{color: '#4F772D'}}>Mes Trajets</h2>
        <div class="d-flex align-items-center">
          <Link to="/map">
            <button class='event-button mb-4'>CREER UN NOUVEAU TRAJET</button>
          </Link>
        </div>
      </div>
      <div style={{ height: '100%', overflowY: 'auto', border: '1px solid #ccc' }}>

        <ul style={{ maxheight: '100vh', overflowY: 'auto'}}>
          {routes.map((route, index) => (
            <li key={route.name} onClick={() => handleRouteClick(route)} style={{ cursor: 'pointer', border: selectedRoute === route ? '4px solid #414833' : '1px solid #414833' }}>
              
              <div class="rounded-3 p-4 mx-auto" style={{position: "relative"}}>
                <div class="d-flex justify-content-between align-items-center">
                  <span class="fw-bold fs-4 text-dark">{route.name}</span>
                  
                  <button type="button" class="delete" onClick={() => deleteRoute(route.name)}>
                Supprimer
              </button>
                </div>

                <div class="d-flex align-items-center mt-3">
                  <Emplacement style={{ width: '20px', height: '20px' }} class="icon me-3"/> 
                  <div>
                    <p class="mb-0">{route.startAdress}</p>
                    <p class="mb-0">{route.endAdress}</p>
                  </div>
                </div>

                <div class="d-flex align-items-center mt-3">
                  {route.planning.dates.map((date, index) => {
                    // create a new date object from the date string
                    const d = new Date(date);
                    // formated the date
                    const formattedDate = `${d.toLocaleDateString('fr-FR')}`;
                    return (<li key={index}>
                      <Calendrier style={{ width: '20px', height: '20px' }} class="icon"/>
                      {formattedDate}
                    </li>);
                  })}
                </div>

                <div class="d-flex align-items-center mt-3">
                  {route.planning.dates.map((date, index) => {
                    // create a new date object from the date string
                    const d = new Date(date);
                    // formated the date
                    const formattedTime = `${d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
                    return <li key={index}>
                      <Horloge style={{ width: '20px', height: '20px' }} class="icon"/> 
                      {formattedTime}
                    </li>
                  })}
                </div>
              </div>
              <ul> Horaires hebdomadaires :
                {route.planning.periodic.map((periodic, index) => (
                  <li key={index}> {getDayOfWeek(periodic.dayOfWeek)+" "}
                  {isValidDate(periodic.time) ? periodic.time.toLocaleTimeString([],{
                    hour: '2-digit', 
                    minute: '2-digit', 
                    hour12: false })
                  : 'Invalid Time' } 
                </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

      </div>
    </div>
  );
};

export default ListRoute;
