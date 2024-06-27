import {createContext, useEffect, useState} from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const UserContext = createContext({});

export function UserContextProvider({children}) {
  const [username, setUsername] = useState(null);
  const [id, setId] = useState(null);

  useEffect(() => {
    const token = Cookies.get("token");
    console.log(token);
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