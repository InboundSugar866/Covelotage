import React, {useEffect} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import avatar from '../assets/profile.png'
import toast, {Toaster} from 'react-hot-toast'
import {useFormik} from 'formik'
import { passwordValidate } from '../helper/validate'
import useFetch from '../hooks/fetch.hook'
import { useAuthStore } from '../store/store'
import { verifyPassword } from '../helper/userHelper'

import backgroundImage from '../assets/Fond_urbain1.jpg';
import Footer from '../components/Footer';

import '../styles/Login.css';

export default function Password() {

  const navigate = useNavigate();

  const { username } = useAuthStore(state => state.auth)
  const [{ isLoading, apiData, serverError }] = useFetch(`/user/${username}`)

  const formik = useFormik({
    initialValues : {
      password : 'admin@12'
    },
    validate : passwordValidate,
    validateOnBlur : false,
    validateOnChange : false,
    onSubmit : async values => {
      let loginPromise = verifyPassword({ username, password : values.password});
      toast.promise(loginPromise, {
        loading : 'Checking ...',
        success : <b>Login Succesfully</b>,
        error : <b>Password not Match!</b>
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
    return <h1 className="">{serverError}</h1>
  }

  return (
<div>
<Toaster position="" reverseOrder={false}></Toaster>
    <div
      className="container-fluid d-flex align-items-center justify-content-center "
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

      <div className="position-absolute top-0 end-0 bottom-0 start-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(5px)' }}></div>



      <div className="card p-4" style={{ width: '45%', borderRadius: '15px' }}>
        <div className="text-center mb-4">
          <h4 className="mb-0">Bonjour {apiData?.firstName || apiData?.username}</h4>
          <span>Explorez plus en vous connectant avec nous.</span>
        </div>

        <form className="row g-3" onSubmit={formik.handleSubmit}>
          <div className="col-md-6">
            <img src={apiData?.profile || avatar} className="img-fluid rounded-circle" alt="avatar" />
          </div>

          <divcon className="col-md-6">
            <input {...formik.getFieldProps('password')} type="password" className="form-control" placeholder="Password" />
            <button type="submit" className="btn btn-primary w-100">
              Se connecter
            </button>
          </divcon>

          <div className="col-12">
            <span>
              Vous avez oublié votre mot-de-passe ? <Link className="text-decoration-none" to="/Recovery">
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
