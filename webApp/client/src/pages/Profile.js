import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';

// Helper Functions
import { profileValidate } from '../helper/validate';
import convertToBase64 from '../helper/convert';
import useFetch from '../hooks/fetch.hook';
import { updateUser } from '../helper/userHelper';

// Components
import { LogoutButton } from '../components/LogoutButton';
import Footer from '../components/Footer';

// Assets
import avatar from '../assets/profile.png';
import backgroundImage from '../assets/Fond_urbain1.jpg';
import { ReactComponent as Profil } from '../assets/Profil.svg';
import { ReactComponent as Messagerie } from '../assets/icon_messagerie.svg';
import { ReactComponent as Trajet } from '../assets/icon_trajet.svg';

/**
 * Profile Component
 * Displays the user's profile, including the ability to update profile information and upload a profile picture.
 *
 * @returns {JSX.Element} The rendered Profile component.
 */
export default function Profile() {
  const [file, setFile] = useState();
  const [{ isLoading, apiData, serverError }] = useFetch();

  /**
   * Formik configuration for handling form input and validation.
   */
  const formik = useFormik({
    initialValues: {
      name: apiData?.name || '',
      surname: apiData?.surname || '',
      email: apiData?.email || '',
      phone: apiData?.phone || '',
      street: apiData?.street || '',
      postCode: apiData?.postCode || '',
      city: apiData?.city || '',
    },
    enableReinitialize: true,
    validate: profileValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      values = await Object.assign(values, { profile: file || apiData?.profile || '' });

      const updatePromise = updateUser(values);
      toast.promise(updatePromise, {
        loading: 'Mise à jour ...',
        success: <b>Mise à jour effectuée</b>,
        error: <b>Problème lors de la mise à jour</b>,
      });
    },
  });

  /**
   * Handles file upload and converts it to base64.
   *
   * @param {Object} e - The event object containing the uploaded file.
   */
  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  };

  if (isLoading) return <h1>isLoading</h1>;
  if (serverError) return <h1>{serverError}</h1>;

  return (
    <div>
      <Toaster position="bottom-center" reverseOrder={false}></Toaster>
      <div
        class="container-fluid d-flex align-items-center justify-content-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'black',
          position: 'relative',
          backgroundRepeat: 'no-repeat',
          flex: 1,
          minHeight: '75vh'
        }}
      >

        <div
          class="rounded p-4"
          style={{
            width: '40%',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            boxShadow: '0px 0px 15px 0px rgba(0,0,0,0.1)',
            position: 'relative',
            zIndex: '1',
          }}
        >

          {/* Navigation Bar */}
          <nav class="navbar d-flex justify-content-end p-2 float-end" style={{ zIndex: '2' }}>
              <Link class="border border-2 border-dark rounded-3 mx-1 mt-2" to="/nvxtrajet">
                  <Trajet style={{ width: '100px', height: '100px', filter: 'invert(1) hue-rotate(180deg)' }} alt='commencer'/>
              </Link>
              <Link class="border border-2 border-dark rounded-3 mx-1 mt-2" to="/chat">
                  <Messagerie style={{ width: '100px', height: '100px', filter: 'invert(1) hue-rotate(180deg)' }} alt='commencer'/>
              </Link>
              <Link class="border border-4 border-success rounded-3 mx-1 mt-2" to="/profile">
                  <Profil style={{ width: '100px', height: '100px' }} alt='commencer'/>
              </Link>
          </nav>

          <form onSubmit={formik.handleSubmit} style={{ zIndex: '1' }}>
            <div class="mb-2 text-center">
              <label htmlFor="profile">
                <img src={file || apiData?.profile || avatar} class="img-fluid rounded-circle" alt="avatar" style={{ maxWidth: '120px' }} />
              </label>

              <input onChange={onUpload} type="file" id="profile" name="profile" style={{ display: 'none' }} />
            </div>

            <div class="mb-2">
              <input {...formik.getFieldProps('name')} class="form-control" type="text" placeholder="Prénom" />
            </div>
            <div class="mb-2">
              <input {...formik.getFieldProps('surname')} class="form-control" type="text" placeholder="Nom" />
            </div>
            <div class="mb-2">
              <input {...formik.getFieldProps('phone')} class="form-control" type="text" placeholder="Numéro de téléphone" />
            </div>
            <div class="mb-2">
              <input {...formik.getFieldProps('email')} class="form-control" type="text" placeholder="Email" />
            </div>
            <div class="mb-2">
              <input {...formik.getFieldProps('street')} class="form-control" type="text" placeholder="Numéro et rue" />
            </div>
            <div class="mb-2">
              <input {...formik.getFieldProps('postCode')} class="form-control" type="text" placeholder="Code postal" />
            </div>
            <div class="mb-2">
              <input {...formik.getFieldProps('city')} class="form-control" type="text" placeholder="Ville" />
            </div>

            <div class="mb-2 text-center">
              <button class="btn btn-primary w-100" type="submit">
                Mettre à jour
              </button>
            </div>

            <LogoutButton />

          </form>
        </div>

        {/* The following div creates the blurred overlay */}
        <div
          class="position-absolute top-0 end-0 bottom-0 start-0"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(5px)',
          }}
        ></div>

      </div>
    <Footer/>
    </div>
  )
}