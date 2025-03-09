import axios from 'axios';
// Library for advanced geospatial analysis
import * as turf from '@turf/turf';

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

/**
 * Get the shortest path between two points.
 *
 * This function sends user-defined points to the server and receives the shortest path,
 * transforming it into a list of [lat, lng] coordinates.
 *
 * @async
 * @function
 * @param {Array<Object>} userPoints - Array of points, where each point is an object with `lat` and `lng` properties.
 * @returns {Promise<Array<Array<number>>>} Promise resolving to the shortest path as an array of [lat, lng] pairs.
 * @throws {Object} Error object with a message on failure.
 */
export async function getShortestPath(userPoints) {
  try {
    const formatedPoints = userPoints.map((point) =>
      JSON.stringify([point.lng, point.lat])
    );

    const r = await axios.post(`/api/shortestPath`, { points: formatedPoints });
    const {
      data: { data },
    } = r;

    const transformedPoints = data.map((point) => {
      const [lng, lat] = JSON.parse(point);
      return [lat, lng];
    });

    return Promise.resolve(transformedPoints);
  } catch (error) {
    return Promise.reject({
      error: 'Problème lors du calcul du trajet',
    });
  }
}

/**
 * Find matches for a given route.
 *
 * This function sends route data to the server to find route matches based on similarities.
 *
 * @async
 * @function
 * @param {Object} routeData - The route data to analyze for matches.
 * @returns {Promise<Object>} Promise resolving to an object containing matched routes and similarities.
 * @throws {Error} Error object if the request fails.
 */
export async function findMatches(routeData) {
  try {
    const token = await localStorage.getItem('token');
    const {
      data: { similarities },
    } = await axios.post('/api/findMatches', routeData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const routes = [];
    similarities.forEach((similaritie) => {
      routes.push(similaritie.route);
    });

    return Promise.resolve({ routes, similarities });
  } catch (error) {
    return Promise.reject(error);
  }
}

/**
 * Update the index of intermediate points.
 *
 * This function adjusts intermediate points by finding and associating them with the nearest point in a received points list.
 *
 * @async
 * @function
 * @param {Array<Array<number>>} receivedPoints - List of points to compare against, where each point is an array [lat, lng].
 * @param {Array<Object>} intermediatePoints - List of intermediate points to update, where each point has a `latlng` property with `lat` and `lng`.
 * @returns {Promise<Array<Object>>} Promise resolving to the updated list of intermediate points.
 * @throws {Object} Error object with a message on failure.
 */
export async function updateIndex(receivedPoints, intermediatePoints) {
  try {
    const formatedIntermediatePoints = intermediatePoints.map((point) => {
      return [point.latlng.lat, point.latlng.lng];
    });

    const newIntermediatePoints = formatedIntermediatePoints.map((point) => {
      const nearestIndex = findClosestPointIndex(point, receivedPoints);
      const modifiedPoint = {
        latlng: {
          lat: point[0],
          lng: point[1],
        },
        index: nearestIndex,
      };
      return modifiedPoint;
    });

    return Promise.resolve(newIntermediatePoints);
  } catch (error) {
    return Promise.reject({
      error: 'Problème lors de la mise à jour du trajet',
    });
  }
}

/**
 * Find the index of the nearest point in a list.
 *
 * This function uses Turf.js to determine the nearest point on a line created from a list of points.
 *
 * @function
 * @param {Array<number>} point - A point represented as an array [lat, lng].
 * @param {Array<Array<number>>} pointsList - The list of points to search through, where each point is an array [lat, lng].
 * @returns {number} The index of the nearest point in the list.
 */
function findClosestPointIndex(point, pointsList) {
  const pointsListLine = turf.lineString(pointsList);
  const nearestPoint = turf.nearestPointOnLine(pointsListLine, point);
  return nearestPoint.properties.index;
}
