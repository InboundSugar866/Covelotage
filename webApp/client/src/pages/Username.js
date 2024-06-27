import React, { useEffect } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {Toaster} from 'react-hot-toast'
import {useFormik} from 'formik'
import { usernameValidate } from '../helper/validate'
import { useAuthStore } from '../store/store'

import backgroundImage from '../assets/Fond_urbain1.jpg';
import Footer from '../components/Footer';

import '../styles/Login.css';

export default function Username() { 

  const navigate = useNavigate();
  const setUsername = useAuthStore(state => state.setUsername);

  const formik = useFormik({
    initialValues : {
      username : 'example123'
    },
    validate : usernameValidate,
    validateOnBlur : false,
    validateOnChange : false,
    onSubmit : async values => {
      setUsername(values.username);
      navigate('/password')
    }
  });



  return (
    <div>
    <Toaster position="bottom-center" reverseOrder={false}></Toaster>

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
      minHeight: '75vh'
    }}
  >

    {/* The following div creates the blurred overlay */}
    <div
      className="position-absolute top-0 end-0 bottom-0 start-0"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(5px)',
      }}
    ></div>


    <div
      className="card p-4"
      style={{
        position: 'relative',
        zIndex: '1',
      }}
    >
      <div className="text-center mb-4">
        <h4 className="mb-0">Heureux de vous revoir !</h4>
      </div>

      <form onSubmit={formik.handleSubmit}>
        <div className="mb-3">
          <input
            {...formik.getFieldProps('username')}
            type="text"
            className="form-control"
            placeholder="Username"
          />
        </div>

        <div className="mb-3">
          <button type="submit" className="btn btn-primary w-100">
            Se connecter
          </button>
        </div>

        <div className="text-center">
          <span>
            Pas encore membre ? <Link to="/register">S'enregistrer</Link>
          </span>
        </div>
      </form>
    </div>

  </div>
  <Footer/>
  </div>
  )
}
