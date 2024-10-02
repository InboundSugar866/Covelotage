import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import avatar from '../assets/profile.png';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { profileValidate } from '../helper/validate';
import convertToBase64 from '../helper/convert';
import useFetch from '../hooks/fetch.hook'
import { updateUser } from '../helper/userHelper';
import { LogoutButton } from '../components/LogoutButton'

import backgroundImage from '../assets/Fond_urbain1.jpg';
import Footer from '../components/Footer';
import { ReactComponent as Profil } from '../assets/Profil.svg';
import { ReactComponent as Messagerie } from '../assets/icon_messagerie.svg';
import { ReactComponent as Trajet } from '../assets/icon_trajet.svg';
import { NavLink } from 'react-router-dom';

export default function Profile() {

  const navigate = useNavigate();

  const [file, setFile] = useState();
  const [{ isLoading, apiData, serverError }] = useFetch()


  const formik = useFormik({
    initialValues : {
      firstName : apiData?.firstName || '',
      lastName: apiData?.lastName || '',
      email: apiData?.email || '',
      mobile: apiData?.mobile || '',
      address : apiData?.address || ''
    },
    enableReinitialize : true,
    validate : profileValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit : async values => {
      // < || '' > <=> If the file is empty return nothing
      values = await Object.assign(values, { profile : file || apiData?.profile || ''})

      let updatePromise = updateUser(values);
      toast.promise(updatePromise, {
        loading : 'Updating ...',
        success : <b>Update Succesfully</b>,
        error : <b>Could not Update!</b>
      });
      
    }
  })

  /** formik doensn't support file upload so we need to create this handler */
  const onUpload = async e => {
    // < e.target.files[0] > collect image just upload
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  }

  if (isLoading) {
    return <h1>isLoading</h1>
  };
  if (serverError) {
    return <h1>{serverError}</h1>
  }

  return (
    <div>
      <Toaster position="bottom-center" reverseOrder={false}></Toaster>
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

{/*
        <div className="text-center mb-4">

          <h4 className="mb-0">Profile</h4>
          <span>You can update the details.</span>
        </div>
*/}
        <form onSubmit={formik.handleSubmit} style={{ zIndex: '1' }}>
          <div class="mb-3 text-center">
            <label htmlFor="profile">
              <img src={file || apiData?.profile || avatar} class="img-fluid rounded-circle" alt="avatar" style={{ maxWidth: '120px' }} />
            </label>

            <input onChange={onUpload} type="file" id="profile" name="profile" style={{ display: 'none' }} />
          </div>

          <div class="mb-3">
            <input {...formik.getFieldProps('firstName')} class="form-control" type="text" placeholder="Prénom" />
          </div>
          <div class="mb-3">
            <input {...formik.getFieldProps('lastName')} class="form-control" type="text" placeholder="Nom" />
          </div>
          <div class="mb-3">
            <input {...formik.getFieldProps('mobile')} class="form-control" type="text" placeholder="Numéro de téléphone" />
          </div>
          <div class="mb-3">
            <input {...formik.getFieldProps('email')} class="form-control" type="text" placeholder="Email" />
          </div>
          <div class="mb-3">
            <input {...formik.getFieldProps('address')} class="form-control" type="text" placeholder="Addresse" />
          </div>

          <div class="mb-3 text-center">
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