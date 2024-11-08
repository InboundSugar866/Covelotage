import React from 'react';
import { useNavigate } from 'react-router-dom';

/** logout button component */
export const LogoutButton = () => {
  const navigate = useNavigate();

  const userLogout = () => {
    localStorage.removeItem('token');

    // Remove the cookie
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    navigate('/');
  };

  return (
    <div class="text-center">
      <span>
        Revenir plus tard,{''}
        <button onClick={userLogout} class="btn btn-link">
          Se déconnecter
        </button>
      </span>
    </div>
  );
};