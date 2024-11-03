import React, { useState, useEffect } from 'react';
import { getDayOfWeek } from '../helper/routeHelper';

import 'react-datepicker/dist/react-datepicker.css';
import 'rc-time-picker/assets/index.css';

import { ReactComponent as Emplacement} from '../assets/emplacement.svg';
import { ReactComponent as Horloge} from '../assets/horloge.svg';
import { ReactComponent as Calendrier} from '../assets/calendrier.svg';

export const MatchList = ({ routes, onSelectMatchingRoute, handleFindMatches}) => {

  // state to store the selected route
  const [selectedRoute, setSelectedRoute] = useState(null);

  // wait to process the request to find matches
  const [loading, setLoading] = useState(false);


  // function to handle the click on a route
  const handleRouteClick = (route, index) => {
    setSelectedRoute(route);
    onSelectMatchingRoute(index);
    // onSelectRoute(route);
  };

  const handleFindMatchesBtn = async (route) => {
    // before sending the request, set the loading state to true
    setLoading(true);
    try {
        await handleFindMatches(route);
        console.log('handleFindMatchesBtn OK');
      // const userRoutes = await getAllRoutes();
      // setRoutes(userRoutes);
      // console.log('userRoutes', userRoutes);
    } catch (error) {
      console.error('Erreur lors du chargement des routes :', error);
    }
    // once the request is processed, set the loading state to false
    setLoading(false);
  }

  function BetterAdress(route)  {
    console.log(route);
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

  // Helper function to check if the date is valid 
  function isValidDate(d) { 
    return d instanceof Date && !isNaN(d); 
  }


  return (
    <div>
      <h2 class='me-5' style = {{color: '#4F772D'}}>Trajets correspondant</h2>

      <div style={{ height: '100%', overflowY: 'auto', border: '1px solid #ccc' }}>
        <ul>
          {routes.map((route, index) => (
            <li key={route.name} onClick={() => handleRouteClick(route, index)} style={{ cursor: 'pointer', border: selectedRoute === route ? '4px solid #4F772D' : '1px solid #414833', borderRadius: '10px', marginTop:'1rem'}}>
              {/*
              <p>{route.name}</p>
              <ul> Dates :
                {route.planning.dates.map((date, index) => {
                    // create a new date object from the date string
                    const d = new Date(date);
                    // formated the date
                    const formattedDate = `${d.toLocaleDateString('fr-FR')} ${d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
                    return <li key={index}>{formattedDate}</li>
                })}
              </ul>

              <ul> Horaires hebdomadaires :
                {route.planning.periodic.map((periodic, index) => (
                  <li key={index}>{getDayOfWeek(periodic.dayOfWeek)} {periodic.time}</li>
                ))}
              </ul>
              */}
              <div class="rounded-3 p-4 mx-auto" style={{position: "relative"}}>
                <div class="d-flex justify-content-between align-items-center">
                  <span class="fw-bold fs-4 text-dark">{route.username}</span>
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

                <div class="d-flex flex-column">
                  <span class="fs-5">Commentaire de {route.username}</span>
                  <div>
                    {route.comment}
                  </div>
                </div>
                {/*<button class="event-button">TROUVER UN COVELOTEUR!</button>*/}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
