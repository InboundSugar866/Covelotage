import React, { useEffect, useState, useRef } from 'react'
import toast, {Toaster} from 'react-hot-toast'
import { useAuthStore } from '../store/store'
import { generateOTP, verifyOTP } from '../helper/userHelper';
import { useNavigate } from 'react-router-dom'

import backgroundImage from '../assets/Fond_urbain1.jpg';
import Footer from '../components/Footer';

import '../styles/Login.css';

export default function Recovery() {

  const { username } = useAuthStore(state => state.auth);

  const [OTP, setOTP] = useState();
  const navigate = useNavigate();

  /** 
   * Skip the initial render and then every time the value of username changes, 
   * the code inside useEffect will be re-executed. 
   */
  useEffect(() => {
    // Skip the initial render
    generateOTP(username).then((status) => {
      if (status === 200) return toast.success('OTP has been sent to your email!');
      return toast.error('Problem while generating OTP!');
    }).catch(error => { console.log(error)});
    
  }, [username]);

  async function onSubmit(e){
    e.preventDefault();
    try {
      let { status } = await verifyOTP({ username, code : OTP })
      if(status === 201){
        toast.success('Verify Successfully!')
        return navigate('/reset')
      }  
    } catch (error) {
      return toast.error('Wrong OTP! Check email again!')
    }
  }

  // handler of resend OTP
  function resendOTP(){
    let sentPromise = generateOTP(username);

    toast.promise(sentPromise ,
      {
        loading: 'Sending...',
        success: <b>OTP has been send to your email!</b>,
        error: <b>Could not Send it!</b>,
      }
    );      
  }


  return (

    <div>
          <Toaster position="top-center" reverseOrder={false}></Toaster>
    <div
    className="container-fluid d-flex align-items-center justify-content-center position-relative"
    style={{
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      color: 'black',
      position: 'relative',
      backgroundRepeat: 'no-repeat',
      flex: 1,
      minHeight: '75vh',
    }}
  >


    <div
      className="position-absolute top-0 end-0 bottom-0 start-0"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
        backdropFilter: 'blur(5px)', 
      }}
    ></div>

    <div
      className="rounded p-4"
      style={{
        width: '40%',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        boxShadow: '0px 0px 15px 0px rgba(0,0,0,0.1)',
        position: 'relative',
        zIndex: 1, // Ensure the card is above the blurred background
      }}
    >
      <div className="text-center">
        <h4 className="mb-0">Récupération</h4>
      </div>

      <form onSubmit={onSubmit} className="mt-4">
        <div className="mb-3">
          <span>Entrez le code envoyé par mail :</span>
          <input
            onChange={(e) => setOTP(e.target.value)}
            type="password"
            className="form-control"
            placeholder="OTP"
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Réinitialiser
        </button>
      </form>

      <div className="text-center mt-3">
        <span>
          Vous n'avez rien reçu ? <button onClick={resendOTP} className="btn btn-link">Renvoyer</button>
        </span>
      </div>
    </div>
  </div>
  <Footer/>
  </div> 

  )
}
