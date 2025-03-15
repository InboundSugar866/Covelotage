/**
 * @fileOverview This file contains the implementation of a custom React hook `useFetch`. This hook simplifies data
 * fetching from a server by managing the API call, loading state, and error handling. It uses Axios for HTTP requests 
 * and React's useState and useEffect hooks for state management and lifecycle behavior. The hook supports both user-based 
 * token retrieval and query-based requests, making it versatile for various use cases.
 */

import axios from "axios";
import { useEffect, useState } from "react";
import { getUsername } from '../helper/userHelper'

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

/** custom hook */
export default function useFetch(query){
    const [getData, setData] = useState({ isLoading : false, apiData: undefined, status: null, serverError: null })

    useEffect(() => {

        const fetchData = async () => {
            try {
                setData(prev => ({ ...prev, isLoading: true}));

                // During the login, we use the query; otherwise, we use the token
                const { username } = !query ? await getUsername() : '';
                
                const { data, status } = !query ? await axios.get(`/api/user/${username}`) : await axios.get(`/api/${query}`);

                if(status === 201){
                    setData(prev => ({ ...prev, isLoading: false}));
                    setData(prev => ({ ...prev, apiData : data, status: status }));
                }

                setData(prev => ({ ...prev, isLoading: false}));
            } catch (error) {
                setData(prev => ({ ...prev, isLoading: false, serverError: error }))
            }
        };
        fetchData()

    }, [query]);

    return [getData, setData];
}