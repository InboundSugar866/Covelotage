/**
 * @fileOverview This file contains the implementation of the MatchList React component. The MatchList component 
 * is designed to display a list of routes and enable user interaction by selecting specific routes. It leverages 
 * React hooks such as useState for state management and integrates helper functions for additional functionality. 
 * The component supports visual enhancements through imported styles and SVG assets, ensuring an intuitive user 
 * interface. Callback functions are used to handle user interactions, making the component flexible and easily 
 * integrable within a larger application.
 */

// React and Related Hooks
import React, { useState } from 'react';

// Helper Functions
import { getDayOfWeek } from '../helper/routeHelper';

// Styles
import 'react-datepicker/dist/react-datepicker.css';

// Assets
import { ReactComponent as Emplacement } from '../assets/emplacement.svg';
import { ReactComponent as Horloge } from '../assets/horloge.svg';
import { ReactComponent as Calendrier } from '../assets/calendrier.svg';

/**
 * MatchList component.
 *
 * This component displays a list of routes and allows the user to select a specific route. When a route
 * is selected, it calls the `onSelectMatchingRoute` function passed as a prop with the index of the selected route.
 *
 * @component
 * @param {Array} routes - Array of route objects to be displayed.
 * @param {Function} onSelectMatchingRoute - Callback function triggered when a route is selected, with the route's index as an argument.
 * @param {Array} similarities - Array representing similarities or metadata associated with the routes.
 * @returns {JSX.Element} A JSX element displaying the list of routes and allowing interaction.
 */
export const MatchList = ({ routes, onSelectMatchingRoute, similarities }) => {
  // State to store the selected route
  const [selectedRoute, setSelectedRoute] = useState(null);

  /**
   * Handles the user clicking on a route.
   *
   * Sets the selected route and triggers the callback to inform the parent component.
   *
   * @function
   * @param {Object} route - The route object that was clicked.
   * @param {number} index - The index of the clicked route in the routes array.
   * @returns {void}
   */
  const handleRouteClick = (route, index) => {
    setSelectedRoute(route); // Update state with the selected route
    onSelectMatchingRoute(index); // Call parent callback with the selected index
  };

  /**
   * Helper function to check if a given date is valid.
   *
   * @function
   * @param {Date} d - The date to validate.
   * @returns {boolean} Returns `true` if the date is valid, otherwise `false`.
   */
  function isValidDate(d) {
    return d instanceof Date && !isNaN(d); // Check if the input is a valid Date object
  }

  return (
    <div>
      <h2 className='me-5' style={{ color: '#4F772D' }}>Trajets correspondant</h2>
  
      <div style={{ height: '100%', overflowY: 'auto', border: '1px solid #ccc' }}>
        <ul style={{ maxHeight: '100vh', overflowY: 'auto' }}>
          {routes.map((route, index) => {
            // Find the corresponding similarity for this route
            const similarity = similarities.find(similarity => similarity.route._id === route._id);
            
            return (
              <li key={route.name} onClick={() => handleRouteClick(route, index)} style={{ cursor: 'pointer', border: selectedRoute === route ? '4px solid #4F772D' : '1px solid #414833', borderRadius: '10px', marginTop: '1rem' }}>
                <div className="rounded-3 p-4 mx-auto" style={{ position: "relative" }}>
                  <div className="d-flex align-items-center">
                    <span className="fw-bold fs-4 text-dark">{route.username}</span>
                    {similarity && (
                      <span className="mx-2 fs-5 fw-bold" style={{ color: '#4F772D' }}>
                        {/* Display the similarity score */}
                        - {similarity.similarity.toFixed(2)*100}% de similarité
                      </span>
                    )}
                  </div>
  
                  <div className="d-flex align-items-center mt-3">
                    <Emplacement style={{ width: '20px', height: '20px' }} className="icon me-3" /> 
                    <div>
                      <p className="mb-0">{route.startAdress}</p>
                      <p className="mb-0">{route.endAdress}</p>
                    </div>
                  </div>
  
                  <div className="d-flex align-items-center mt-3">
                    {route.planning.dates.map((date, index) => {
                      // Create a new date object from the date string
                      const d = new Date(date);
                      // Format the date
                      const formattedDate = `${d.toLocaleDateString('fr-FR')}`;
                      return (
                        <li key={index}>
                          <Calendrier style={{ width: '20px', height: '20px' }} className="icon" />
                          {formattedDate}
                        </li>
                      );
                    })}
                  </div>
  
                  <div className="d-flex align-items-center mt-3">
                    {route.planning.dates.map((date, index) => {
                      // Create a new date object from the date string
                      const d = new Date(date);
                      // Format the date
                      const formattedTime = `${d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
                      return (
                        <li key={index}>
                          <Horloge style={{ width: '20px', height: '20px' }} className="icon" />
                          {formattedTime}
                        </li>
                      );
                    })}
                  </div>
  
                  <ul>Horaires hebdomadaires:
                    {route.planning.periodic.map((periodic, index) => (
                      <li key={index}>
                        {getDayOfWeek(periodic.dayOfWeek) + " "}
                        {isValidDate(periodic.time) ? periodic.time.toLocaleTimeString([], {
                          hour: '2-digit', 
                          minute: '2-digit', 
                          hour12: false
                        }) : 'Invalid Time' }
                      </li>
                    ))}
                  </ul>
  
                  <div className="d-flex flex-column">
                    <span className="fs-5 fw-bold" style={{ color: '#4F772D' }}>Commentaire de {route.username}</span>
                    <div>
                      {route.comment}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
