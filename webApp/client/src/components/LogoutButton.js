/**
 * @fileOverview This file contains the implementation of the LogoutButton React component. The component provides
 * a user-friendly logout functionality by clearing authentication data (like tokens from local storage and cookies) 
 * and redirecting users to the home page. It leverages the useNavigate hook from react-router-dom for navigation and 
 * ensures a seamless logout process. The LogoutButton is designed to be simple, accessible, and easy to integrate into 
 * any application requiring secure session management.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * LogoutButton component.
 *
 * This component renders a logout button that, when clicked, clears the user's authentication data
 * (e.g., token stored in local storage and cookies) and redirects them to the home page.
 *
 * @component
 * @returns {JSX.Element} A JSX element containing the logout button.
 */
export const LogoutButton = () => {
  const navigate = useNavigate();

  /**
   * Handles user logout by removing authentication data and redirecting to the home page.
   *
   * @function
   * @returns {void}
   */
  const userLogout = () => {
    localStorage.removeItem('token'); // Remove the token from local storage
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // Clear the token cookie
    navigate('/'); // Navigate to the home page
  };

  return (
    <div class="text-center">
      <span>
        Revenir plus tard,{' '}
        <button onClick={userLogout} class="btn btn-link">
          Se déconnecter
        </button>
      </span>
    </div>
  );
};
