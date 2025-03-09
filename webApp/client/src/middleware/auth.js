import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/store";

/**
 * Protect the Profile route by ensuring the user is authorized.
 *
 * This component checks if a valid authentication token exists in the local storage.
 * If the token is missing, it redirects the user to the login page.
 *
 * @function
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to render if the user is authorized.
 * @returns {JSX.Element} The child components if authorized, otherwise redirects to the login page.
 */
export const AuthorizeUser = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to={'/login'} replace={true}></Navigate>;
  }

  return children;
};

/**
 * Protect the Password route by ensuring the user has a valid username.
 *
 * This component checks if the username exists in the application's state.
 * If the username is missing, it redirects the user to the login page.
 *
 * @function
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to render if the user has a valid username.
 * @returns {JSX.Element} The child components if the username is valid, otherwise redirects to the login page.
 */
export const ProtectRoute = ({ children }) => {
  const username = useAuthStore.getState().auth.username;

  if (!username) {
    return <Navigate to={'/login'} replace={true}></Navigate>;
  }

  return children;
};
