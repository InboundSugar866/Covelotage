import React from 'react';
import { Link } from 'react-router-dom'
import backgroundImage from '../assets/Fond_urbain1.jpg';

import { ReactComponent as TrouverCoveloteur } from '../assets/TrouverCoveloteur.svg';
import { ReactComponent as Profil } from '../assets/Profil.svg';

import '../styles/Home.css';

/** Components */
import Footer from '../components/Footer';


export default function Home() {
  return (
    <div className='general'>
      <div className='backgroundImage' style={{backgroundImage: `url(${backgroundImage})`}}>
          {/* Navigation Bar */}
          <nav className="navbar">
            <Link className="profile" to="/login">
              <Profil style={{ width: '100px', height: '100px' }} alt='commencer'/>
            </Link>
          </nav>

          <div className="main">
            <div className="text">
              <h2 className="text1">Covelotage</h2>
              <p className="text11">Votre Communaute Cycliste</p>
              <p className="text2">Le covelotage est une initiative visant à rendre l’utilisation du vélo plus accessible au quotidien, en encourageant les cyclistes grâce à la mise en relation avec d’autres utilisateurs partageant des itinéraires similaires.</p>
              
              <Link to="/login">
                <TrouverCoveloteur style={{ width: '700px', height: '100px', margin: '30px' }} alt='commencer'/>
              </Link>

              {/* Features Section */}
              <div className="text3">
                <div className="text31">
                  <div className="text31blocks">
                    <h2>TROUVEZ un coveloteur</h2>
                    <p>Entrez les itinéraires que vous emprûntés quotidiennement sur le secteur du Grand Nancy, et contactez d’autres cyclistes avec un trajet similaire au votre.</p>
                  </div>
                  <div className="text31blocks">
                    <h2>DECOUVRIR DES PARCOURS</h2>
                    <p>Explorez des itinéraires de vélo sûrs et populaires dans le Grand Nancy. Obtenez des informations sur des lieux de stationnement, les points d’eau, et plus encore.</p>
                  </div>
                  <div className="text31blocks">
                    <h2>TROUVEZ VOTRE COMPAGNON</h2>
                    <p>Rejoignez une communauté cycliste et dynamique. Interragissez avec d’autres utilisateurs, partagez des expériences et contribuez à un environnement urbain plus sûr.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      <Footer/>
    </div>
  );
};