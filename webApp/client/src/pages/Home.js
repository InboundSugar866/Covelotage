import React from 'react';
import { Link } from 'react-router-dom';

// Assets
import backgroundImage from '../assets/Fond_urbain.jpg';
import { ReactComponent as TrouverCoveloteur } from '../assets/TrouverCoveloteur.svg';
import { ReactComponent as Profil } from '../assets/Profil.svg';

// Styles
import '../styles/Home.css';

// Components
import Footer from '../components/Footer';

/**
 * Represents the Home page component.
 * 
 * This component displays the main structure and content of the home page,
 * including a navigation bar, background image, and detailed sections with
 * community-related information.
 *
 * @returns {JSX.Element} The JSX for the Home page.
 */
export default function Home() {
  return (
    <body>
      <div class="d-flex flex-column min-vh-100">
        <container class='flex-grow-1'>
          <div class="flex-grow-1 d-flex flex-column" className='backgroundImage' style={{backgroundImage: `url(${backgroundImage})`}}>
            <div style={{height: '75vh'}}>

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
                  
                  <div class="d-flex justify-content-center my-5">
                    <Link to="/login">
                      <TrouverCoveloteur class="mx-auto d-block"  alt="commencer" />
                    </Link>
                  </div>

                  <div >
                    <div class="d-flex justify-content-center gap-5">
                      <div class="fs-4 col-3 text-justify bg-white-50 rounded p-2">
                        <h2>Trouvez un coveloteur</h2>
                        <p class="fs-5 fw-light text-justify">Entrez les itinéraires que vous emprûntez quotidiennement sur le secteur du Grand Nancy, et contactez d’autres cyclistes avec un trajet similaire au votre.</p>
                      </div>
                      <div class="fs-4 col-3 text-justify bg-white-50 rounded p-2">
                        <h2>Decouvrir des parcours</h2>
                        <p class="fs-5 fw-light">Explorez des itinéraires de vélo sûrs et populaires dans le Grand Nancy. Obtenez des informations sur des lieux de stationnement, les points d’eau, et plus encore.</p>
                      </div>
                      <div class="fs-4 col-3 text-justify bg-white-50 rounded p-2">
                        <h2>Trouvez votre compagnon</h2>
                        <p class="fs-5 fw-light">Rejoignez une communauté cycliste dynamique. Interragissez avec d’autres utilisateurs, partagez des expériences et contribuez à un environnement urbain plus sûr.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </container>
        <footer class='mt-auto'>
          <Footer class='footer'/>
        </footer>
      </div>
    </body>
  );
};