import './index.css';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';


/** import all components */
import Login from './pages/Login';
import Password from './pages/Password';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Recovery from './pages/Recovery';
import Reset from './pages/Reset';
import Map from './pages/Map';
import PageNotFound from './pages/PageNotFound';
import Home from './pages/Home';
import Chat from './pages/Chat';

import axios from "axios";
import {UserContextProvider} from "./pages/UserContext";
import Routes from "./pages/Routes";

import 'bootstrap/dist/css/bootstrap.min.css'

/** auth middleware */
import { AuthorizeUser, ProtectRoute } from './middleware/auth';

/** roor routes */
const router = createBrowserRouter([
  {
    path : '/',
    element : <Home/>
  },
  {
    path : '/login',
    element : <Login/>
  },
  {
    path : '/register',
    element : <Register/>
  },
  {
    path : '/password',
    element : <ProtectRoute> <Password /> </ProtectRoute> 
  },
  {
    path : '/Profile',
    element : <AuthorizeUser> <Profile /> </AuthorizeUser> 
  },
  {
    path : '/Recovery',
    element : <ProtectRoute> <Recovery/></ProtectRoute>
  },
  {
    path : '/Reset',
    element : <Reset/>
  },
  {
    path : '/map',
    element : <AuthorizeUser> <Map/> </AuthorizeUser>
  },
  {
    path : '/PageNotFound',
    element : <PageNotFound/>
  },
  {
    path : '/Chat',
    element : <Chat/>
  },
  {
    path : '/Routes',
    element : <Routes/>
  },
  {
    path : '/UserContext',
    element : <UserContextProvider/>
  }
])


function App() {
  return (
    <main>
        <RouterProvider router={router}></RouterProvider>
    </main>
  );
}

export default App;
