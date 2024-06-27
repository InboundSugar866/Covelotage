import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';
import toast from 'react-hot-toast';

import { Link } from 'react-router-dom'
import '../styles/CreateRoute.css';

import { ReactComponent as CreerTrajet } from '../assets/CreerTrajer.svg';


import { getDayOfWeek } from '../helper/routeHelper';


export const CreateRoute = ({ createRoute, selectedRoute, selectionUpdate, updateRoute, handleFindMatches, 
                              startAddress, setStartAddress, endAddress, setEndAddress, 
                              startAddressSuggestions, endAddressSuggestions, handleSearch, handleSuggestionClick}) => {
  const [routeName, setRouteName] = useState('');
  const [comment, setComment] = useState('');
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const [selectedPeriodicTimes, setSelectedPeriodicTimes] = useState([]);
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState(0);
  const [selectedTime, setSelectedTime] = useState(null);
  
  const periodicDateRef = new Date(1970, 0, 1);

  // for the adress search


  // Check if the hour is valid
  const isValidHour = (date) => {
    const hour = date.getHours();
    return hour >= 0 && hour <= 23;
  };

  // Add a date
  const handleAddDate = () => {
    if (selectedDate && isValidHour(selectedDate)) {
      setSelectedDates([...selectedDates, selectedDate]);
      setSelectedDate(null);
    } else {
      console.error('Heure invalide');
    }
  };

  // Remove a date
  const handleRemoveDate = (index) => {
    const updatedDates = [...selectedDates];
    updatedDates.splice(index, 1);
    setSelectedDates(updatedDates);
  };

  // Add a periodic time
  const handleAddPeriodicTime = () => {
    // Check that the time and day of the week are selected
    if (selectedTime == null || selectedDayOfWeek == null) {
      console.error('Heure invalide ou jour non sélectionné');
      return;
    }
    // Create a new date object with a fixed date (1st January 1970) 
    const selectedDateTime = periodicDateRef;
    // set the time to the selected time 
    selectedDateTime.setHours(selectedTime.hours(), selectedTime.minutes(), 0);
    // assenble the day of the week and the time
    const newPeriodicTime = {
      dayOfWeek: selectedDayOfWeek,
      time: selectedDateTime,
    };
    // update the selectedPeriodicTimes array
    setSelectedPeriodicTimes([...selectedPeriodicTimes, newPeriodicTime]);
  };

  // Remove a periodic time
  const handleRemovePeriodicTime = (index) => {
    const updatedPeriodicTimes = [...selectedPeriodicTimes];
    updatedPeriodicTimes.splice(index, 1);
    setSelectedPeriodicTimes(updatedPeriodicTimes);
  };

  function getValideRouteInfos() {
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
      },
      "startAdress": startAddress,
      "endAdress": endAddress,
      "comment": comment
    }
    console.log('routeInfos', routeInfos);
    return routeInfos;
  }

  // Submit the form to create a new route
  const handleCreateRoute = (e) => {
    e.preventDefault();
    // Verify that all the required information is filled
    const routeInfos = getValideRouteInfos();
    if (routeInfos) {
      // If the conditions are met, submit the form
      createRoute(routeInfos);
    }
  };

   // Submit the form
  const handleUpdateRoute = (e) => {
    e.preventDefault();
    // Verify that all the required information is filled
    const routeInfos = getValideRouteInfos();
    if (routeInfos) {
      // If the conditions are met, submit the form
      updateRoute(routeInfos);
    }
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
  
  // Formated the selected date
  const formatSelectedDate = (date) => {

    const formattedDate = new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',periodicDateRef
    }).format(date);

    return formattedDate;
  };


  // update the form when a route is selected
  useEffect(() => {
    // if no route is selected, return
    if (!selectedRoute) return;
    // update the name of the route
    setRouteName(selectedRoute.name);
    // update the comment
    setComment(selectedRoute.comment);
    // update the selected dates
    setSelectedDates(selectedRoute.planning.dates);
    // update the selected periodic times
    setSelectedPeriodicTimes(selectedRoute.planning.periodic);
  }, [selectedRoute, selectionUpdate]);

  return (
    <div>

      <form onSubmit={handleCreateRoute}>
        <h2>Entrer un nouveau trajet</h2>
  
        <div>
          <label>Nom du trajet :</label>
            <div>
            <input required={true} type="text" value={routeName} onChange={(e) => setRouteName(e.target.value)} />
            </div>
          
        </div>
  


        {/** start point adress */}
        <div>
          
          <label>Adresse de depart :</label>
            <div>
            <input 
              type="search"
              name="startPointSearch"
              value={startAddress}
              onChange={(e) => {
                setStartAddress(e.target.value);
                handleSearch(e.target.value, true);
              }}
            />
            </div>
            {startAddressSuggestions.map((suggestion, index) => (
              <div key={index} onClick={() => handleSuggestionClick(suggestion, true)}>
                {suggestion.label}
              </div>
            ))}
          
        </div>

        {/** end point adress */}
        <div>
          
          <label>Adresse d'arrivee :</label>
            <div>
            <input 
              type="search"
              name="endPointSearch"
              value={endAddress}
              onChange={(e) => {
                setEndAddress(e.target.value);
                handleSearch(e.target.value, false);
              }}
            />
            </div>
            {endAddressSuggestions.map((suggestion, index) => (
              <div key={index} onClick={() => handleSuggestionClick(suggestion, false)}>
                {suggestion.label}
              </div>
            ))}
          
        </div>

        <div>
          <label>Date et heure de depart :</label>
          <DatePicker
            selected={selectedDate}
            onChange={(value) => setSelectedDate(value)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={5}
            timeCaption="Time"
            dateFormat="dd/MM/yyyy HH:mm"
            isClearable
            placeholderText="Sélectionnez une date"
            popperPlacement="bottom-start"
            portalId="root-portal"
          />
          <button type="button" onClick={handleAddDate}>
            +
          </button>
          
        </div>
  
        <div>
          <ul>
            {selectedDates.map((date, index) => (
              <li key={index}>
                {formatSelectedDate(date)}
                <button type="button" onClick={() => handleRemoveDate(index)}>
                  -
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <label>Ajouter un commentaire :</label>
            <div>
            <input required={false} type="text" value={comment} onChange={(e) => setComment(e.target.value)} />
            </div>
          
        </div>
  
        <div>
          <h2>Ajouter une periodicite : </h2>
          </div>

          <div>
            <label>Jour de la semaine : </label>
            <select
              value={selectedDayOfWeek}
              onChange={(e) => setSelectedDayOfWeek(parseInt(e.target.value, 10))}
            >
              <option value={1}>Lundi</option>
              <option value={2}>Mardi</option>
              <option value={3}>Mercredi</option>
              <option value={4}>Jeudi</option>
              <option value={5}>Vendredi</option>
              <option value={6}>Samedi</option>
              <option value={0}>Dimanche</option>
            </select>
          </div>
          <div>
            <label>Heure : </label>
            <TimePicker
              showSecond={false}
              defaultValue={selectedTime}
              onChange={(value) => {setSelectedTime(value)}}
            />
            <button type="button" onClick={handleAddPeriodicTime}>
              +
            </button>
          </div>
  
          <ul>
            {selectedPeriodicTimes.map((periodicTime, index) => (
              <li key={index}>
                {`
                  ${getDayOfWeek(periodicTime.dayOfWeek)} 
                  ${periodicTime.time.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit', 
                      hour12: false
                    })}
                `}
                <button type="button" onClick={() => handleRemovePeriodicTime(index)}>
                  -
                </button>
              </li>
            ))}
          </ul>

          <div>
          <h2>Carte </h2>
          </div>
  
        
  
        <button type="submit">
          <CreerTrajet/>
        </button>



      </form>
     {/*       <button onClick={handleFindMatchesBtn}>
        Trouver les correspondances
      </button> */}


      {/* Bouton pour mettre à jour le trajet */}
      {selectedRoute && (
        <button type="button" onClick={handleUpdateRoute}>
          Modifier le trajet
        </button>
      )}

    </div>
  );
};


