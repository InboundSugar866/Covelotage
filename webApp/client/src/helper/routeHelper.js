import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

/**
 * Retrieve all routes of a user.
 *
 * This function sends a request to the server to fetch all routes associated with the logged-in user.
 *
 * @async
 * @function
 * @returns {Promise<Object>} Promise resolving to the response data containing the user's routes.
 * @throws {Error} Error object if the request fails.
 */
export async function getAllRoutes() {
  try {
    const token = await localStorage.getItem('token');
    const response = await axios.get(`/api/getroutes`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * Add a new route to the server.
 *
 * This function sends the provided route data to the server for storage.
 *
 * @async
 * @function
 * @param {Object} routeData - The data of the route to be added.
 * @returns {Promise<void>} Resolves if the route is successfully added.
 * @throws {Object|Error} Error object if the request fails or the response status is not 201.
 */
export async function addRouteToServer(routeData) {
  try {
    const token = await localStorage.getItem('token');
    const { status } = await axios.post('/api/addroute', routeData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (status !== 201) {
      return Promise.reject({
        error: "Problème lors de l'ajout du trajet",
      });
    }
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
}

/**
 * Update an existing route.
 *
 * This function sends updated route data to the server.
 *
 * @async
 * @function
 * @param {Object} routeData - The updated route data.
 * @returns {Promise<void>} Resolves if the route is successfully updated.
 * @throws {Object|Error} Error object if the request fails or the response status is not 201.
 */
export async function updateRoute(routeData) {
  try {
    const token = await localStorage.getItem('token');
    const { status } = await axios.put('/api/updateRoute', routeData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (status !== 201) {
      return Promise.reject({
        error: 'Problème lors de la mise à jour du trajet',
      });
    }
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
}

/**
 * Delete a route from the server.
 *
 * This function sends a request to the server to delete the specified route.
 *
 * @async
 * @function
 * @param {string} routeName - The name of the route to be deleted.
 * @returns {Promise<void>} Resolves if the route is successfully deleted.
 * @throws {Object|Error} Error object if the request fails or the response status is not 201.
 */
export async function deleteRoute(routeName) {
  try {
    const token = await localStorage.getItem('token');
    const { status } = await axios.delete('/api/deleteRoute', {
      headers: { Authorization: `Bearer ${token}` },
      data: { name: routeName },
    });
    if (status !== 201) {
      return Promise.reject({
        error: 'Problème lors de la suppression du trajet',
      });
    }
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
}

/**
 * Get the day of the week.
 *
 * This function converts a day index (0 for Sunday, 6 for Saturday) to the corresponding French day name.
 *
 * @function
 * @param {number} dayOfWeek - The index of the day (0 for Sunday, 1 for Monday, ..., 6 for Saturday).
 * @returns {string} The name of the day in French.
 */
export const getDayOfWeek = (dayOfWeek) => {
  const days = [
    'Dimanche',
    'Lundi',
    'Mardi',
    'Mercredi',
    'Jeudi',
    'Vendredi',
    'Samedi',
  ];
  return days[dayOfWeek];
};