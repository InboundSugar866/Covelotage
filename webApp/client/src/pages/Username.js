import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';

// Helper Functions
import { usernameValidate } from '../helper/validate';

// Store
import { useAuthStore } from '../store/store';

// Assets
import backgroundImage from '../assets/Fond_urbain1.jpg';

// Components
import Footer from '../components/Footer';

// Html
export default function Username() { 

  const navigate = useNavigate();
  const setUsername = useAuthStore(state => state.setUsername);

  const formik = useFormik({
    initialValues: { username: '',
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

        {/* The following div creates the blurred overlay */}
        <div
          class="position-absolute top-0 end-0 bottom-0 start-0"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(5px)',
          }}
        ></div>

        <div
          class="card p-4"
          style={{
            position: 'relative',
            zIndex: '1',
          }}
        >
          <div class="text-center mb-4">
            <h4 class="mb-0">Heureux de vous revoir !</h4>
          </div>

          <form onSubmit={formik.handleSubmit}>
            <div class="mb-3">
              <input
                {...formik.getFieldProps('username')}
                type="text"
                class="form-control"
                placeholder="Nom d'utilisateur"
              />
            </div>

            <div classe="mb-3">
              <button type="submit" class="btn btn-primary w-100">
                Se connecter
              </button>
            </div>

            <div class="text-center">
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
