import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import avatar from '../assets/profile.png';
import toast, {Toaster} from 'react-hot-toast';
import {useFormik} from 'formik';
import { registerValidate } from '../helper/validate';
import convertToBase64 from '../helper/convert';
import { registerUser } from '../helper/userHelper';

import backgroundImage from '../assets/Fond_urbain1.jpg';
import Footer from '../components/Footer';

//import '../styles/Login.css';

export default function Register() {

  const navigate = useNavigate();
  // Profile image
  const[file, setFile] = useState();

  const formik = useFormik({
    initialValues : {
      email: 'c666@gmail.com',
      username: 'example123',
      password : 'admin@12',
      name : 'John',
      surname : 'Doe'
    },
    validate : registerValidate,
    validateOnBlur : false,
    validateOnChange : false,
    onSubmit : async values => {
      // < || '' > <=> If the file is empty return nothing
      values = await Object.assign(values, {profile : file || ''});

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
          console.log("err.msg : ",err.msg)
          toast.error(err.msg);
        }        
      });
    }
  });

  /** formik doesn't support file upload so we need to create this handler */
  const onUpload = async e => {
    // < e.target.files[0] > collect image just upload
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  }

  return (
    <div>

      <Toaster position="top-center" reverseOrder={false}></Toaster>

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

        <div className="position-absolute top-0 end-0 bottom-0 start-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(8px)' }}>
        </div>


        <divgen className="card p-4" style={{ width: '45%', borderRadius: '15px' }}>
          <div className="text-center mb-4">
            <h4 className="mb-0">Bienvenue</h4>
            <span>Nous sommes heureux de vous recevoir parmis nous !</span>
          </div>

          <form className="form-container" onSubmit={formik.handleSubmit}>
            <divphoto>
              <label htmlFor="profile" className="form-label">
                <img src={file || avatar} className="img-fluid rounded-circle" alt="avatar" style={{width:'200px'}} />
              </label>
              <input onChange={onUpload} type="file" id="profile" name="profile" className="form-control" />
            </divphoto>

            <divtext>
              <input {...formik.getFieldProps('name')} type="text" className="form-control" placeholder="Name*" required/>
              <input {...formik.getFieldProps('surname')} type="text" className="form-control" placeholder="Surname*" required/>
              <input {...formik.getFieldProps('username')} type="text" className="form-control" placeholder="Username*" required/>
              <input {...formik.getFieldProps('phone')} type="tel" className="form-control" placeholder="Phone" required/>
              <input {...formik.getFieldProps('adress')} type="text" className="form-control" placeholder="Adresse" required/>
              <input {...formik.getFieldProps('email')} type="text" className="form-control" placeholder="Email*" required/>
              <input {...formik.getFieldProps('password')} type="password" className="form-control" placeholder="Password*" required/>
              <button type="submit" className="btn btn-primary w-100">
                S'enregister
              </button>
            </divtext>

            <div className="col-12">
              <span>
                Vous possédez déjà un compte ? <Link className="text-decoration-none" to="/login">
                  Se connecter
                </Link>
              </span>
            </div>
          </form>
        </divgen>
      </div>
      <Footer/>
    </div>
         

  )
}

