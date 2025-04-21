/**
 * @fileOverview This file contains the PageNotFound component for the Covelotage application.
 * It displays a message indicating that the requested page was not found.
 * The component provides a link for users to navigate back to the homepage.
 * It uses various HTML elements to structure and present the information,
 * and includes a background image and a footer component.
 */

import React from 'react'
import { Link } from 'react-router-dom';

// Assets
import backgroundImage from '../assets/Fond_urbain1.jpg';

// Components
import Footer from '../components/Footer';

export default function PageNotFound() {
  return (
    <div>
      <div
        class="container-fluid d-flex align-items-center justify-content-center "
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'black',
          position: 'relative',
          backgroundRepeat: 'no-repeat',
          flex: 1,
          minHeight: '75vh'
        }}
      >

        <div class="d-flex flex-column align-items-center text-center">
          <h1>
            La page que vous cherchez a ete deplacée ou n'existe plus.
          </h1>
          <Link to="/">
            <h3 class="mx-auto d-block" alt="commencer">Revenir</h3>
          </Link>
        </div>
      </div>
      <Footer/>
    </div>
  )
}
