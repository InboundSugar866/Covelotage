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

/** root routes */
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

function App() {
  axios.defaults.withCredentials = true;
  return (
    <main>
      <RouterProvider router={router}></RouterProvider>
    </main>
  );
}

export default App;