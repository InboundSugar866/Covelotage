/**
 * @fileOverview Handles API routes for shortest path and route matching services.
 */

import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';
import { getRevelentsRoutes } from '../database/req.js';
import { 
    parseCoordinates, 
    formatCoordinates, 
    compareUserRouteWithRelevantRoutes 
} from '../utils/algorithm.js';

const apikey = process.env.APIKey;

axios.defaults.baseURL = process.env.MAP_API_URI;

/**
 * Computes the shortest path based on provided coordinates using the OpenRouteService API.
 * 
 * @async
 * @function shortestPath
 * @param {Object} req - The request object from the client.
 * @param {Object} req.body - The body of the request object.
 * @param {Array} req.body.points - The coordinates provided by the client.
 * @param {Object} res - The response object to send the results back to the client.
 * @returns {Promise<Object>} - A promise resolving to the HTTP response with the shortest path.
 */
export async function shortestPath(req, res) {
    try {
        const points = parseCoordinates(req.body.points);
        const response = await axios.post(
            `/v2/directions/cycling-regular/geojson`, 
            { coordinates: points },
            { headers: { 'Authorization': `Bearer ${apikey}` } }
        ); 
        const routeCoordinates = formatCoordinates(response.data.features[0].geometry.coordinates);
        return res.status(201).send({ data: routeCoordinates });
    } catch (error) {
        return res.status(500).send(error);
    }
}

/**
 * Finds matching routes from the database that align with a user's route.
 * 
 * @async
 * @function findMatches
 * @param {Object} req - The request object from the client.
 * @param {Object} req.body - The body of the request object.
 * @param {Array} req.body - The user's route data.
 * @param {Object} res - The response object to send the results back to the client.
 * @returns {Promise<Object>} - A promise resolving to the HTTP response with similarity matches.
 */
export async function findMatches(req, res) {
    try {
        const userRoute = req.body; 
        const relevantRoutes = await getRevelentsRoutes(req);
        const similarities = await compareUserRouteWithRelevantRoutes(userRoute, relevantRoutes, 0);
        res.status(200).json({ similarities });     
    } catch (error) {
        return res.status(500).send(error);
    }
}
