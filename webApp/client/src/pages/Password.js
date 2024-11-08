import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';

// Helper Functions
import { passwordValidate } from '../helper/validate';
import useFetch from '../hooks/fetch.hook';
import { verifyPassword } from '../helper/userHelper';

// Store
import { useAuthStore } from '../store/store';

// Assets
import avatar from '../assets/profile.png';
import backgroundImage from '../assets/Fond_urbain1.jpg';

// Components
import Footer from '../components/Footer';

// Html
export default function Password() {

  const navigate = useNavigate();

  const { username } = useAuthStore(state => state.auth)
  const [{ isLoading, apiData, serverError }] = useFetch(`/user/${username}`)

  const formik = useFormik({
    initialValues : {
      password : ''
    },
    validate : passwordValidate,
    validateOnBlur : false,
    validateOnChange : false,
    onSubmit : async values => {
      let loginPromise = verifyPassword({ username, password : values.password});
      toast.promise(loginPromise, {
        loading : 'Connexion en cours ...',
        success : <b>Connecté !</b>,
        error : <b>Le mot de passe est erroné</b>
      });

      loginPromise.then(res => {
        let { token } = res.data;
        localStorage.setItem('token', token);
        navigate('/NvxTrajet');
      }).catch(error => { });
    }
  });

  if (isLoading) {
    return <h1>isLoading</h1>
  };
  if (serverError) {
    return <h1 class="">{serverError}</h1>
  }

  return (
    <div>
      <Toaster position="" reverseOrder={false}></Toaster>
      <div
        class="container-fluid d-flex align-items-center justify-content-center "
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          position: 'relative',
          backgroundRepeat: 'no-repeat',
          flex: 1,
          minHeight: '75vh'
        }}
      >

        <div class="position-absolute top-0 end-0 bottom-0 start-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(5px)' }}></div>



        <div class="card p-4" style={{ borderRadius: '15px' }}>
          <div class="text-center mb-4">
            <h4 class="mb-0">Bonjour {apiData?.firstName || apiData?.username}</h4>
            <span>Explorez plus en vous connectant avec nous.</span>
          </div>

          <form class="form-container text-center" onSubmit={formik.handleSubmit}>
            <div class="mb-2">
              <img src={apiData?.profile || avatar} class="img-fluid rounded-circle" style={{ width: '200px' }} alt="avatar" />
            </div>

            <div class="mb-2">
              <input {...formik.getFieldProps('password')} type="password" class="form-control mb-2" placeholder="Password" />
              <button type="submit" class="btn btn-primary w-100">
                Se connecter
              </button>
            </div>

            <div class="col-12">
              <span>
                Vous avez oublié votre mot-de-passe ? <Link  to="/Recovery">
                  Récupérer
                </Link>
              </span>
            </div>
          </form>
        </div>

      </div>
      <Footer/>
    </div>
  );
}
