/**
 * @fileOverview This file contains the Password component for the Covelotage application.
 * It displays a login form where users can enter their password to authenticate.
 * The component uses Formik for form management and validation, and provides feedback
 * using toast notifications. It also includes functionality to navigate to the recovery
 * page if the user has forgotten their password.
 */

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

/**
 * Password component for user login.
 * Displays a login form where users can enter their password to authenticate.
 *
 * @component
 * @returns {JSX.Element} - The rendered password component.
 */
export default function Password() {
  const navigate = useNavigate();

  // Get the username from the authentication store.
  const { username } = useAuthStore(state => state.auth);

  // Fetch API data for the current user.
  const [{ isLoading, apiData, serverError }] = useFetch(`/user/${username}`);

  // Formik hook for managing form state and submission.
  const formik = useFormik({
    initialValues: {
      password: '', // Password input field initialized as empty.
    },
    validate: passwordValidate, // Validation function for the password input.
    validateOnBlur: false, // Disable validation on blur.
    validateOnChange: false, // Disable validation on change.
    onSubmit: async values => {
      let loginPromise = verifyPassword({ username, password: values.password });
      
      // Show toast notifications for the login process.
      toast.promise(loginPromise, {
        loading: 'Connexion en cours ...', // Loading message.
        success: <b>Connecté !</b>, // Success message.
        error: <b>Le mot de passe est erroné</b>, // Error message.
      });

      loginPromise
        .then(res => {
          let { token } = res.data;
          localStorage.setItem('token', token); // Save the token locally.
          navigate('/NvxTrajet'); // Navigate to the new route.
        })
        .catch(error => {
          // Handle login errors (optional).
        });
    },
  });

  if (isLoading) {
    return <h1>isLoading</h1>; // Render loading state.
  }
  
  if (serverError) {
    return <h1>{serverError}</h1>; // Render server error.
  }

  return (
    <div>
      <Toaster position="" reverseOrder={false} />
      <div
        className="container-fluid d-flex align-items-center justify-content-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          position: 'relative',
          backgroundRepeat: 'no-repeat',
          flex: 1,
          minHeight: '75vh',
        }}
      >
        <div
          className="position-absolute top-0 end-0 bottom-0 start-0"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(5px)' }}
        />
        <div className="card p-4" style={{ borderRadius: '15px' }}>
          <div className="text-center mb-4">
            <h4 className="mb-0">Bonjour {apiData?.firstName || apiData?.username}</h4>
            <span>Explorez plus en vous connectant avec nous.</span>
          </div>
          <form className="form-container text-center" onSubmit={formik.handleSubmit}>
            <div className="mb-2">
              <img
                src={apiData?.profile || avatar}
                className="img-fluid rounded-circle"
                style={{ width: '200px' }}
                alt="avatar"
              />
            </div>
            <div className="mb-2">
              <input
                {...formik.getFieldProps('password')}
                type="password"
                className="form-control mb-2"
                placeholder="Password"
              />
              <button type="submit" className="btn btn-primary w-100">
                Se connecter
              </button>
            </div>
            <div className="col-12">
              <span>
                Vous avez oublié votre mot-de-passe ? <Link to="/Recovery">Récupérer</Link>
              </span>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
