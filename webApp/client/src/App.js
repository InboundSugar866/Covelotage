/**
 * @fileOverview This file contains the main application component for the Covelotage application.
 * It sets up the router and Axios configuration, and provides context providers for user authentication.
 * The component imports and configures all the necessary routes and their corresponding components.
 */

//import './index.css';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';

import axios from "axios";

/** import all components */
import Username from './pages/Username';
import Password from './pages/Password';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Recovery from './pages/Recovery';
import Reset from './pages/Reset';
import Map from './pages/Map';
import PageNotFound from './pages/PageNotFound';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Mentions from './pages/Mentions';
import NvxTrajet from './pages/NvxTrajet';
import {UserContextProvider} from "./pages/UserContext";

import 'bootstrap/dist/css/bootstrap.min.css'

/** auth middleware */
import { AuthorizeUser, ProtectRoute } from './middleware/auth';

/** Routing Configuration */
/**
 * @constant {Object} router
 * @description Router configuration object containing all application routes and their components.
 */
const router = createBrowserRouter([
  {
    path : '/',
    element : <Home/>
  },
  {
    path : '/login',
    element : <Username/>
  },
  {
    path : '/register',
    element : <UserContextProvider><Register/></UserContextProvider>
  },
  {
    path : '/password',
    element : <ProtectRoute> <Password /> </ProtectRoute>
  },
  {
    path : '/Profile',
    element : <UserContextProvider><AuthorizeUser> <Profile /> </AuthorizeUser></UserContextProvider>
  },
  {
    path : '/Recovery',
    element : <UserContextProvider><ProtectRoute> <Recovery/></ProtectRoute></UserContextProvider>
  },
  {
    path : '/Reset',
    element : <UserContextProvider><Reset/></UserContextProvider>
  },
  {
    path : '/map',
    element : <UserContextProvider><AuthorizeUser> <Map/> </AuthorizeUser></UserContextProvider>
  },
  {
    path : '/PageNotFound',
    element :<PageNotFound/>
  },
  {
    path : '/Mentions',
    element :<Mentions/>
  },
  {
    path : '/Chat',
    element : <UserContextProvider><AuthorizeUser> <Chat/> </AuthorizeUser></UserContextProvider>
  },
  {
    path : '/NvxTrajet',
    element : <UserContextProvider><AuthorizeUser> <NvxTrajet/> </AuthorizeUser></UserContextProvider>
  }
])

/**
 * @function App
 * @description The main application component that sets up the router and Axios configuration.
 *
 * @returns {JSX.Element} The application with configured routing and context providers.
 */
function App() {
  axios.defaults.withCredentials = true;
  return (
    <main>
      <RouterProvider router={router}></RouterProvider>
    </main>
  );
}

export default App;