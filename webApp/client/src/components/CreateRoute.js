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
                              startAddressSuggestions, endAddressSuggestions, handleSearch, handleSuggestionClick, handlePathSubmit}) => {
  const [routeName, setRouteName] = useState('');
  const [comment, setComment] = useState('');
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const [selectedPeriodicTimes, setSelectedPeriodicTimes] = useState([]);
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState(0);
  const [selectedTime, setSelectedTime] = useState(null);
  
  const periodicDateRef = new Date(1970, 0, 1);

    // received points from the server
    const [receivedPoints, setReceivedPoints] = useState([]);
      // refresh the list of routes
  const [refresh, setRefresh] = useState(false);

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

    // Submit the form
    const handleUpdateRoute = (e) => {
      e.preventDefault();
      // Verify that all the required information is filled
      const routeInfos = getValideRouteInfos();
      if (routeInfos) {
        // If the conditions are met, submit the form
        handleUpdateRoute2(routeInfos);
      }
    };
  
    // Handle the update of a route
    const handleUpdateRoute2 = (formData) => {
  
      // format the data for the server
      const data = formatRoute(formData, receivedPoints);
      // add the route to the server
      const updateRoutePromise = updateRoute(data);
  
      toast.promise(updateRoutePromise, {
        loading: 'Updating route...',
        success: <b>Route mise à jour</b>,
        error: (err) => <b>{err.response.data.error}</b>,
      });
  
      updateRoutePromise.then(() => {
        // update the list of routes
        setRefresh(!refresh);
      }).catch((error) => {"fail to update the list of routes"});
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

// State for showing suggestions list
const [showStartSuggestions, setShowStartSuggestions] = useState(false);
const [showEndSuggestions, setShowEndSuggestions] = useState(false);

useEffect(() => {
  const handleClickOutside = (event) => {
    if (!event.target.closest('.search-container')) {
      setShowStartSuggestions(false);
      setShowEndSuggestions(false);
    }
  };

  document.addEventListener('click', handleClickOutside);
  return () => {
    document.removeEventListener('click', handleClickOutside);
  };
}, []);

function autoResizeTextarea(textarea) {
  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 'px';
}


  return (
    <div>

      <form onSubmit={handleCreateRoute} class="d-flex row justify-content-center">

  
        <h2 style = {{color: '#4F772D'}}>Entrer un nouveau trajet</h2>
          <div class="form-group d-flex align-items-center">
            <div class="row w-100">
              <div class="col-4">
                <h3 class="align-self-start" style={{marginLeft:'2rem'}}>Nom du trajet :</h3>
              </div>
              <div class="col-8">
                <input 
                  required={true} 
                  type="text" 
                  class="form-control border border-dark w-50" 
                  value={routeName} 
                  onChange={(e) => setRouteName(e.target.value)} 
                />
              </div>
            </div>
          </div>

        {/** start point address */}
        <div class="form-group d-flex align-items-center position-relative">
          <div class="row w-100">
            <div class="col-4">
              <h3 class="align-self-start" style={{marginLeft: '2rem'}}>Adresse de depart :</h3>
            </div>
            <div class="col-4 search-container" style={{paddingRight:'0'}}>
              <div>
                <input class="form-control border border-dark w-100"
                      type="search"
                      name="startPointSearch"
                      value={startAddress}
                      onChange={(e) => {
                        setStartAddress(e.target.value);
                        handleSearch(e.target.value, true);
                      }}
                      onFocus={() => setShowStartSuggestions(true)}
                />
                {showStartSuggestions && (
                  <div class="suggestions-list position-absolute w-100">
                    {startAddressSuggestions.map((suggestion, index) => (
                      <div key={index} onClick={() => handleSuggestionClick(suggestion, true)}>
                        {suggestion.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div class="col-4 d-flex justify-content-center align-items-center">
              <button type="button" class='event-button' style={{marginLeft:'2rem'}} onClick={handlePathSubmit}>
                Recalculer le trajet
              </button>
            </div>
          </div>
        </div>                  

        {/** end point address */}
        <div class="form-group d-flex align-items-center">
          <div class="row w-100">
            <div class="col-4">
              <h3 class="align-self-start" style={{marginLeft:'2rem'}}>Adresse d'arrivee :</h3>
            </div>
            <div class="col-8 search-container">
              <div class="w-50">
                <input class="form-control border border-dark w-100"
                      type="search"
                      name="endPointSearch"
                      value={endAddress}
                      onChange={(e) => {
                        setEndAddress(e.target.value);
                        handleSearch(e.target.value, false);
                      }}
                      onFocus={() => setShowEndSuggestions(true)}
                />
                {showEndSuggestions && (
                  <div className="suggestions-list position-absolute w-100">
                    {endAddressSuggestions.map((suggestion, index) => (
                      <div key={index} onClick={() => handleSuggestionClick(suggestion, false)}>
                        {suggestion.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div class="form-group d-flex align-items-center">
          <div class="row w-100">
            <div class="col-4 d-flex align-items-center">
              <h3 style={{marginLeft:'2rem'}}>Date et heure de depart :</h3>
            </div>
            <div class="col-4 d-flex align-items-center" style={{paddingRight:'0'}}>
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
            </div>
            <div class="col-4 d-flex justify-content-center align-items-center">
              <button type="button" class='event-button' style={{marginLeft:'2rem'}} onClick={handleAddDate}>
                Confirmer la date et l'heure
              </button>
            </div>
          </div>
        </div>


  
        <div>
          <ul>
            {selectedDates.map((date, index) => (
              <li key={index}>
                {formatSelectedDate(date)}
                <button type="button" onClick={() => handleRemoveDate(index)}>
                  Supprimer
                </button>
              </li>
            ))}
          </ul>
        </div>



        <div class="form-group d-flex align-items-center">
          <div class="row w-100">
            <div class="col-4">
              <h3 class="align-self-start" style={{marginLeft: '2rem'}}>Ajouter un commentaire :</h3>
            </div>
            <div class="col-8">
              <textarea
                required={false}
                value={comment}
                class="form-control border border-dark w-100"
                id="exampleFormControlTextarea1"
                rows="3"
                style={{overflow: 'hidden', resize: 'none'}}
                onChange={(e) => {
                  setComment(e.target.value);
                  autoResizeTextarea(e.target);
                }}
              ></textarea>
            </div>
          </div>
        </div>

  
        <div>
          <h2 style = {{color: '#4F772D'}}>Ajouter une periodicite : </h2>
          </div>

          <div class="form-group d-flex align-items-center">
            <div class="row w-100">
              <div class="col-4">
                <h3 class="align-self-start" style={{marginLeft:'2rem'}}>Jour de la semaine :</h3>
              </div>
              <div class="col-8">
                <select
                  class="event-button"
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
            </div>
          </div>


          <div class="form-group d-flex align-items-center">
  <div class="row w-100">
    <div class="col-4">
      <h3 class="align-self-start" style={{marginLeft:'2rem'}}>Heure :</h3>
    </div>
    <div class="col-8 d-flex align-items-center">
      <TimePicker
        showSecond={false}
        defaultValue={selectedTime}
        onChange={(value) => {setSelectedTime(value)}}
      />
      <button class="event-button" type="button" style={{marginLeft:'2rem'}} onClick={handleAddPeriodicTime}>
        Confirmer la date et l'heure
      </button>
    </div>
  </div>
</div>

  
          <div>
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
                    Supprimer
                  </button>
                </li>
              ))}
            </ul>
          </div> 
  
        <button type="submit" class="btn w-auto">
          <CreerTrajet/>
        </button>



      </form>

    </div>
  );
};


