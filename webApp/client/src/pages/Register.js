/**
 * @fileOverview This file contains the Register component for the Covelotage application.
 * It allows users to register by providing required details and a profile image.
 * The component handles form submission and data validation using Formik,
 * and provides feedback using toast notifications. It also includes a navigation bar and a footer component.
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';

// Helper Functions
import { registerValidate } from '../helper/validate';
import convertToBase64 from '../helper/convert';
import { registerUser } from '../helper/userHelper';

// Assets
import avatar from '../assets/profile.png';
import backgroundImage from '../assets/Fond_urbain1.jpg';

// Components
import Footer from '../components/Footer';

/**
 * React component for the Register page.
 * Allows users to register by providing required details and profile image.
 * Handles form submission and data validation.
 * @returns {JSX.Element} JSX representation of the Register page.
 */
export default function Register() {

  const navigate = useNavigate();
  // Profile image
  const[file, setFile] = useState();

  /**
   * Formik configuration for handling form state, validation, and submission.
  */
  const formik = useFormik({
    initialValues : {
      email: '',
      username: '',
      password : '',
      name : '',
      surname : '',
      street : '',
      postCode : '',
      city : ''
    },
    validate : registerValidate,
    validateOnBlur : false,
    validateOnChange : false,
    onSubmit : async values => {
      // < || '' > <=> If the file is empty return nothing
      const date = new Date();
      const formattedDate = date.toLocaleString('fr-FR', { month: 'long', year: 'numeric' });
      
      values = await Object.assign(values, { profile: file || '', created: formattedDate });

      let registerPromise = registerUser(values)

      toast.promise(registerPromise, {
        loading : 'Creating ...',
        success : <b>Register Succesfully</b>,
        error : <b>Could not Register</b>
      });

      registerPromise.then(function() {
        navigate('/login')
      }).catch(err => { 
        
        if (err.error === "AlreadyExisting") {
          toast.error(err.msg);
        }        
      });
    }
  });

  /**
   * Handles file upload and converts it to base64.
   *
   * @param {Object} e - The event object containing the uploaded file.
   */
  const onUpload = async e => {
    // < e.target.files[0] > collect image just upload
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  }

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div
        class="container-fluid d-flex align-items-center justify-content-center"
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

        <div class="position-absolute top-0 end-0 bottom-0 start-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(8px)' }}></div>

        <div class="card p-4" style={{borderRadius: '15px' }}>
          <div class="text-center mb-4">
            <h4 class="mb-0">Bienvenue</h4>
            <span>Nous sommes heureux de vous recevoir parmis nous !</span>
          </div>

          <form class="form-container text-center" onSubmit={formik.handleSubmit} style={{margin: '0 auto' }}>
            <div class="mb-2">
              <label htmlFor="profile" class="form-label">
                <img src={file || avatar} class="img-fluid rounded-circle" alt="avatar" style={{ width: '200px' }} />
              </label>
              <input onChange={onUpload} type="file" id="profile" name="profile" class="form-control" />
            </div>
            <div class="mb-2">
              <input {...formik.getFieldProps('name')} type="text" class="form-control" placeholder="Prénom" required />
            </div>
            <div class="mb-2">
              <input {...formik.getFieldProps('surname')} type="text" class="form-control" placeholder="Nom" required />
            </div>
            <div class="mb-2">
              <input {...formik.getFieldProps('username')} type="text" class="form-control" placeholder="Nom d'utilisateur" required />
            </div>
            <div class="mb-2">
              <input {...formik.getFieldProps('phone')} type="tel" class="form-control" placeholder="Téléphone" required />
            </div>
            <div class="mb-2">
              <input {...formik.getFieldProps('street')} type="text" class="form-control" placeholder="Numéro et rue" required />
            </div>
            <div class="mb-2">
              <input {...formik.getFieldProps('postCode')} type="text" class="form-control" placeholder="Code postal" required />
            </div>
            <div class="mb-2">
              <input {...formik.getFieldProps('city')} type="text" class="form-control" placeholder="Ville" required />
            </div>
            <div class="mb-2">
              <input {...formik.getFieldProps('email')} type="text" class="form-control" placeholder="Email" required />
            </div>
            <div class="mb-2">
              <input {...formik.getFieldProps('password')} type="password" class="form-control" placeholder="Mot de passe" required />
            </div>
            <div class="mb-2">
              <button type="submit" class="btn btn-primary w-100">S'enregister</button>
            </div>
            <div class="col-12">
              <span>
                Vous possédez déjà un compte ? <Link to="/login">Se connecter</Link>
              </span>
            </div>
          </form>

        </div>
      </div>
      <Footer/>
    </div>
  )
}

