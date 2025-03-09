import {createContext, useEffect, useState} from "react";
import axios from "axios";
import Cookies from "js-cookie";

/**
 * @constant {React.Context} UserContext
 * @description A React context for managing user-related state (username and ID).
 */
export const UserContext = createContext({});

/**
 * @function UserContextProvider
 * @description A React component that provides the UserContext to its children.
 *
 * @param {Object} props - Props object.
 * @param {React.ReactNode} props.children - Child components to be wrapped by the UserContextProvider.
 * @returns {JSX.Element} The provider component with user authentication state.
 */
export function UserContextProvider({children}) {
  const [username, setUsername] = useState(null);
  const [id, setId] = useState(null);

  /**
   * @function useEffect
   * @description React hook to fetch user profile data if a valid token exists.
   *              Makes an API call to retrieve the user ID and username.
  */
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
          axios.get('/profile').then(response => {
      setId(response.data.userId);
      setUsername(response.data.username);
    });
    }

  }, []);

  return (
    <UserContext.Provider value={{username, setUsername, id, setId}}>
      {children}
    </UserContext.Provider>
  );
}