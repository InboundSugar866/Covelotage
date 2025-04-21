/**
 * @fileOverview This file contains the Reset component for the Covelotage application.
 * It provides a form interface for users to reset their password.
 * The component handles form submission and validation using Formik,
 * and provides feedback using toast notifications. It also includes a navigation bar and a footer component.
 */

import React from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { useNavigate, Navigate } from 'react-router-dom';

// Helper Functions
import { resetPasswordValidate } from '../helper/validate';
import { resetPassword } from '../helper/userHelper';
import useFetch from '../hooks/fetch.hook';

// Store
import { useAuthStore } from '../store/store';

// Assets
import backgroundImage from '../assets/Fond_urbain1.jpg';

// Components
import Footer from '../components/Footer';

/**
 * @function Reset
 * @description Component for resetting the user's password using a form.
 *
 * @returns {JSX.Element} A form interface to reset passwords with validation, error handling, and navigation.
 */
export default function Reset() {

  const { username } = useAuthStore(state => state.auth)
  const navigate = useNavigate();
  const [{ isLoading, status, serverError }] = useFetch('createResetSession');

  const formik = useFormik({
    initialValues : {
      password : '',
      confirm_pwd : ''
    },
    validate : resetPasswordValidate,
    validateOnBlur : false,
    validateOnChange : false,
    onSubmit : async values => {
      let resetPromise = resetPassword({ username, password: values.password });

      toast.promise(resetPromise, {
        loading: 'Mise à jour...',
        success: <b>Mise à jour réussie.</b>,
        error : <b>Problème lors de la mise à jour</b>
      });

      resetPromise.then(function(){ 
        navigate('/password')
      }).catch(error => { })
    }
  });

  if (isLoading) return <h1>isLoading</h1>;
  if (serverError) return <h1 class="">{serverError}</h1>;
  if (status && status !== 201) return <Navigate to={'/password'} replace={true} ></Navigate>;

  return (
    <div className="d-flex flex-column min-vh-100">
      <Toaster position="top-center" reverseOrder={false}></Toaster>

      <div
        class="container-fluid d-flex align-items-center justify-content-center flex-grow-1"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'black',
          position: 'relative',
          backgroundRepeat: 'no-repeat',
        }}
      >
    
      <div
        class="position-absolute top-0 end-0 bottom-0 start-0"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(5px)',
        }}
      ></div>

      <div
        class="rounded p-4"
        style={{
          width: '40%',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          boxShadow: '0px 0px 15px 0px rgba(0, 0, 0, 0.1)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div class="text-center">
          <h4 class="">Réinitialiser votre mot de passe</h4>
          <span>Entrez le nouveau mot de passe</span>
        </div>

        <form onSubmit={formik.handleSubmit} class="mt-4">
          <div class="mb-3">
            <input
              {...formik.getFieldProps('password')}
              type="password"
              class="form-control"
              placeholder="Nouveau mot de passe"
            />
            <input
              {...formik.getFieldProps('confirm_pwd')}
              type="password"
              class="form-control mt-2"
              placeholder="Répétez le mot de passe"
            />
          </div>

          <button type="submit" class="btn btn-primary w-100">
            Reset
          </button>
        </form>
      </div>
    
    </div>
  <Footer/>
  </div>
  )
}
