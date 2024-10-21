import React, { useState, useEffect } from 'react';
import { getAllRoutes, getDayOfWeek } from '../helper/routeHelper';
import 'react-datepicker/dist/react-datepicker.css';
import 'rc-time-picker/assets/index.css';
import { Link, Route } from 'react-router-dom'

import { ReactComponent as Emplacement} from '../assets/emplacement.svg';
import { ReactComponent as Horloge} from '../assets/horloge.svg';
import { ReactComponent as Calendrier} from '../assets/calendrier.svg';
import { ReactComponent as Setting} from '../assets/setting.svg';

import '../styles/ListRoute.css';

//import {handleFindMatchesBtn} from '../pages/NvxTrajet';

const ListRoute = ({ refresh, onSelectRoute, deleteRoute}) => {

  // state to store the list of routes
  const [routes, setRoutes] = useState([]);
  // state to store the selected route
  const [selectedRoute, setSelectedRoute] = useState(null);

  // refresh the list of routes 
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const userRoutes = await getAllRoutes();
        // format the periodic times into date objects
        const routes = userRoutes.map((route) => {
          return {
            ...route,
            planning: {
              ...route.planning,
              periodic: route.planning.periodic.map((periodic) => {
                return {
                  ...periodic,
                  time: new Date(periodic.time)
                }
              }),
              dates: route.planning.dates.map((date) => new Date(date))
            }
          };
        });
        setRoutes(routes);
      } catch (error) {
        console.error('Erreur lors du chargement des routes :', error);
      }
    };

    fetchRoutes();
  }, [refresh]);

  // function to handle the click on a route
  const handleRouteClick = (route) => {
    setSelectedRoute(route);
    onSelectRoute(route);
  };


 function BetterAdress(route)  {
  let addressStart = route.startAdress;
  let addressEnd = route.endAdress;

  let parts1 = addressStart.split(", ");
  let parts2 = addressEnd.split(", ");

  // Check if the 7th part is a number
let postalCodeIndex1 = isNaN(parts1[7]) ? 8 : 7;
let postalCodeIndex2 = isNaN(parts2[7]) ? 8 : 7;

// Extract the required parts
let newAddressSart = `${parts1[1]}, ${parts1[2]}, ${parts1[postalCodeIndex1]}, ${parts1[4]}`;
let newAddressEnd = `${parts2[1]}, ${parts2[2]}, ${parts2[postalCodeIndex2]}, ${parts2[4]}`;

return {newAddressSart, newAddressEnd};
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


        <ul>
          {routes.map((route, index) => (
            <li key={route.name} onClick={() => handleRouteClick(route)} style={{ cursor: 'pointer', border: selectedRoute === route ? '4px solid #414833' : '1px solid #414833' }}>
              
              <div class="rounded-3 p-4 mx-auto" style={{maxwidth: "600px", position: "relative"}}>
                <div class="d-flex justify-content-between align-items-center">
                  <span class="fw-bold fs-4 text-dark">{route.name}</span>
                  
                  <button type="button" class="delete" onClick={() => deleteRoute(route.name)}>
                Supprimer
              </button>
                </div>

                <div class="d-flex align-items-center mt-3">
                  <Emplacement style={{ width: '20px', height: '20px' }} class="icon me-3"/> 
                  <div>
                    <p class="mb-0">{BetterAdress(route).newAddressSart}</p>
                    <p class="mb-0">{BetterAdress(route).newAddressEnd}</p>
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

                {/*<button class="event-button">TROUVER UN COVELOTEUR!</button>*/}
              </div>
              
              
            

              <ul> Horaires hebdomadaires :
                {route.planning.periodic.map((periodic, index) => (
                  <li key={index}>
                    {getDayOfWeek(periodic.dayOfWeek)+" "} 
                    {periodic.time.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit', 
                      hour12: false
                    })}
                  </li>
                ))}
              </ul>
               {/* Bouton de suppression 
               <button type="button" onClick={() => deleteRoute(route.name)}>
                Supprimer
              </button>
              
              <button id="findMatchesBtn" onClick={() => showDiv(route)} style={{display: 'block'}}>
                Trouver les correspondances
              </button>*/}
            </li>
          ))}
        </ul>

      </div>
    </div>
  );
};

export default ListRoute;
