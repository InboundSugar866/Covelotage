import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

// Store
import { useAuthStore } from '../store/store';

// Helper Functions
import { generateOTP, verifyOTP } from '../helper/userHelper';

// Assets
import backgroundImage from '../assets/Fond_urbain1.jpg';

// Components
import Footer from '../components/Footer';


// Html
export default function Recovery() {

  const { username } = useAuthStore(state => state.auth);

  const [OTP, setOTP] = useState();
  const navigate = useNavigate();

  /* 
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

// Html
  return (

    <div>
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div
      class="container-fluid d-flex align-items-center justify-content-center position-relative"
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
          class="position-absolute top-0 end-0 bottom-0 start-0"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)', 
            backdropFilter: 'blur(5px)', 
          }}
        >
        </div>

        <div
          class="rounded p-4"
          style={{
            width: '40%',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            boxShadow: '0px 0px 15px 0px rgba(0,0,0,0.1)',
            position: 'relative',
            zIndex: 1, // Ensure the card is above the blurred background
          }}
        >
          <div class="text-center">
            <h4 class="mb-0">Récupération</h4>
          </div>

          <form onSubmit={onSubmit} class="mt-4">
            <div class="mb-3">
              <span>Entrez le code envoyé par mail :</span>
              <input
                onChange={(e) => setOTP(e.target.value)}
                type="password"
                class="form-control"
                placeholder="OTP"
              />
            </div>

            <button type="submit" class="btn btn-primary w-100">
              Réinitialiser
            </button>
          </form>

          <div class="text-center mt-3">
            <span>
              Vous n'avez rien reçu ? <button onClick={resendOTP} class="btn btn-link">Renvoyer</button>
            </span>
          </div>
        </div>
      </div>
    <Footer/>
    </div>
  )
}
