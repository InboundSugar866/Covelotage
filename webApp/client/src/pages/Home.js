import React from 'react';
import { Link } from 'react-router-dom'
import backgroundImage from '../assets/Fond_urbain.jpg';

import { ReactComponent as TrouverCoveloteur } from '../assets/TrouverCoveloteur.svg';
import { ReactComponent as Profil } from '../assets/Profil.svg';

import '../styles/Home.css';

/** Components */
import Footer from '../components/Footer';


export default function Home() {
  return (
    <body>
      <div class="d-flex flex-column min-vh-100">
      <div class='content' className='backgroundImage' style={{backgroundImage: `url(${backgroundImage})`}}>
        <div >
          {/* Navigation Bar */}
          <nav class="p-2 float-end">
            <Link to="/login">
              <Profil alt='commencer'/>
            </Link>
          </nav>

          <div class="p-4 mb-4">
            <div>
              <h1 class="fw-bold text-large">Covelotage</h1>
              <h2 >Votre Communaute Cycliste</h2>
              <p class="fs-5 fw-light w-75">Le covelotage est une initiative visant à rendre l’utilisation du vélo plus accessible au quotidien, en encourageant les cyclistes grâce à la mise en relation avec d’autres utilisateurs partageant des itinéraires similaires.</p>
              
              <Link to="/login">
                <TrouverCoveloteur class="mx-auto d-block my-5" style={{maxwidth: '50%', height: 'auto'}} alt="commencer" />
              </Link>


              {/* Features Section */}
              <div >
                <div class="d-flex justify-content-center gap-5">
                  <div class="fs-4 col-3 text-justify bg-white-50 rounded p-2">
                    <h2>TROUVEZ un coveloteur</h2>
                    <p class="fs-5 fw-light text-justify">Entrez les itinéraires que vous emprûntez quotidiennement sur le secteur du Grand Nancy, et contactez d’autres cyclistes avec un trajet similaire au votre.</p>
                  </div>
                  <div class="fs-4 col-3 text-justify bg-white-50 rounded p-2">
                    <h2>DECOUVRIR DES PARCOURS</h2>
                    <p class="fs-5 fw-light">Explorez des itinéraires de vélo sûrs et populaires dans le Grand Nancy. Obtenez des informations sur des lieux de stationnement, les points d’eau, et plus encore.</p>
                  </div>
                  <div class="fs-4 col-3 text-justify bg-white-50 rounded p-2">
                    <h2>TROUVEZ VOTRE COMPAGNON</h2>
                    <p class="fs-5 fw-light">Rejoignez une communauté cycliste dynamique. Interragissez avec d’autres utilisateurs, partagez des expériences et contribuez à un environnement urbain plus sûr.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </div>
      <Footer class='footer mt-auto'/></div>
    </body>
  );
};