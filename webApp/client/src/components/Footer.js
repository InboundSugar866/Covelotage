/**
 * @fileOverview This file contains the implementation of the Footer component. The Footer
 * is a visually engaging and responsive element that includes essential branding, navigation links, and credits. 
 * It utilizes React, react-router-dom for linking, SVG assets for graphical representation, and CSS for styling.
 * The Footer showcases branding like Covélotage, references to PDIE Technopôle Nancy-Brabois, and provides external
 * links for further user engagement. Additionally, it dynamically renders the current year and a link to legal mentions.
 */

// React Import
import React from 'react';

// Router
import { Link } from 'react-router-dom';

// Assets
import { ReactComponent as YourSvg } from '../assets/TrouverCoveloteur.svg';
import logoPdie from '../assets/PDIE.png';
import { ReactComponent as Route } from '../assets/Route.svg';

// Html
const Footer = () => {
  return (
    <footer class="footer text-black text-center d-flex flex-column align-items-center" style={{height: "25vh", fontweight: "bold", fontsize: "1.3rem", backgroundColor: '#588157'}}>
      <div class="w-100">
        <Route class="w-100" />
      </div>

      <div class="d-flex flex-column justify-content-center align-items-center w-100 py-2" style={{flex: "1"}}>
        <div class="d-flex justify-content-between w-100 mb-2">
          <div class="d-flex flex-column align-items-center justify-content-center me-5" style={{flex: "1"}}>
            <h3>COVELOTAGE</h3>
            <Link to="/login">
              <YourSvg class="w-100" style={{width: "300px", height: "100px"}}/>
            </Link>
          </div>

          <div class="d-flex flex-column align-items-center justify-content-center" style={{flex: "1"}}>
            <h3>UNE INITIATIVE DU PDIE <br/> TECHNOPOLE NANCY BRABOIS</h3>
            <a href="https://pdiebrabois.wordpress.com/">
              <img src={logoPdie} target='_blank' alt='logo_pdie' class="w-100" style={{width: "400px", height: "100px"}}/>
            </a>
          </div>
        </div>

        <span>© {new Date().getFullYear()} Covélotage - PDIE Technopôle Nancy-Brabois - <Link to="/Mentions" class="text-black">Mentions légales</Link></span>
      </div>
    </footer>
    );
  };
  
  export default Footer;