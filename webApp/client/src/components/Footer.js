import React from 'react';

import Mentions from '../pages/Mentions';
import { Link } from 'react-router-dom';

import { ReactComponent as YourSvg } from '../assets/TrouverCoveloteur.svg';
import logoPdie from '../assets/PDIE.png';
import { ReactComponent as Route } from '../assets/Route.svg';

const Footer = () => {
    return (
        <footer style={{
        backgroundColor: '#4F772D',
        color: 'black',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '25VH',
        fontWeight:'bold',
        fontSize:'1.3rem',
        }}>

        <div >
            <Route style={{ width: '100vw'}}/>
        </div> 


        <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            padding: '10px 0',
        }}>
            <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            marginBottom: '10px',
            }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginRight: '30vh' }}>
                <span>COVELOTAGE</span>
                <YourSvg style={{ width: '300px', height: '100px' }}/>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginLeft: '30vh' }}>
                <span>UNE INITIATIVE DU PDIE <br/> TECHONOPOLE NANCY BRABOIS</span>
                <img src={logoPdie} target='_blank' alt='logo_pdie' style={{ width: '400px', height: '100px' }}/>
            </div>
            </div>

            <span>© {new Date().getFullYear()} Covélotage - PDIE Technopôle Nancy-Brabois - <Link to="/Mentions" style={{ color: 'black' }}>Mentions légales</Link></span>
        </div>
        </footer>
    );
  };
  
  export default Footer;