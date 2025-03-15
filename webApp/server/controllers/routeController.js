/**
 * @fileOverview Handles API routes for CRUD operations on routes.
 */

import RouteModel from "../model/Route.model.js";
import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';

axios.defaults.baseURL = process.env.MAP_API_URI;

/**
 * Adds a new route for a user.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.user - The user object from the token.
 * @param {string} req.user.username - The username of the user.
 * @param {Object} req.body - The body of the request object.
 * @param {string} req.body.name - The name of the route.
 * @param {string} req.body.route - The route details.
 * @param {Object} req.body.planning - The planning details of the route.
 * @param {string} req.body.startAdress - The starting address of the route.
 * @param {string} req.body.endAdress - The ending address of the route.
 * @param {string} [req.body.comment] - An optional comment for the route.
 * @param {Object} res - The response object.
 *
 * @returns {Promise<void>} Sends an HTTP response indicating success or failure.
 *
 * @throws Will return an HTTP error response if:
 * - The route already exists with the given name.
 * - There is a server error during the route creation process.
 */
export async function addRoute(req, res) {
    try {
        // Get the username from the token
        const username = req.user.username;
        // Get the route details from the request body
        const {name, route, planning, startAdress, endAdress, comment } = req.body;
        // verify if the route don't exist
        const exitingRoute = await RouteModel.findOne({ username, name });
        if (exitingRoute) {
            return res.status(401).send({ error: "Choisissez un nom unique" });
        }
        // Create a new route object using the RouteModel schema
        const newRoute = new RouteModel({
            username,
            name,
            startAdress,
            endAdress,
            route,
            planning,
            comment
        });
        // Save the new route to the database
        newRoute.save()
            .then(() => {res.status(201).send({ msg: "La route a bien été ajoutée." })})
            .catch((error) => {res.status(500).send({ error });});
    } catch (error) {
        return res.status(500).send({ error });
    }
}

/**
 * Updates an existing route for a user.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.user - The user object from the token.
 * @param {string} req.user.username - The username of the user.
 * @param {Object} req.body - The body of the request object.
 * @param {string} req.body.name - The name of the route.
 * @param {string} req.body.route - The updated route details.
 * @param {Object} req.body.planning - The updated planning details of the route.
 * @param {Object} res - The response object.
 *
 * @returns {Promise<void>} Sends an HTTP response indicating success or failure.
 *
 * @throws Will return an HTTP error response if:
 * - The route does not exist with the given name.
 * - There is a server error during the route update process.
 */
export async function updateRoute(req, res) {
    try {
              
        // Get the username from the token
        const username = req.user.username;
        // Get the route details from the request body
        const {name, route, planning } = req.body;

        // verify if the route exist
        const exitingRoute = await RouteModel.findOne({ username, name });

        if (!exitingRoute) {
            return res.status(404).send({ error: "Route non trouvée!" });
        }

        exitingRoute.route = route;
        exitingRoute.planning = planning;

        exitingRoute.save()
            .then(() => res.status(201).send({ msg: "La route a bien été mise à jour." }))
            .catch((error) => res.status(500).send({ error }));
    } catch (error) {
        return res.status(500).send({ error });
    }
}

/**
 * Deletes an existing route for a user.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.user - The user object from the token.
 * @param {string} req.user.username - The username of the user.
 * @param {Object} req.body - The body of the request object.
 * @param {string} req.body.name - The name of the route to delete.
 * @param {Object} res - The response object.
 *
 * @returns {Promise<void>} Sends an HTTP response indicating success or failure.
 *
 * @throws Will return an HTTP error response if:
 * - The route does not exist with the given name.
 * - There is a server error during the route deletion process.
 */
export async function deleteRoute(req, res) {
    try {

        // Get the username from the token
        const username = req.user.username;
        // Get the route details from the request body              
        const name = req.body.name;
        // delete the route from the database 
        const route = await RouteModel.findOneAndDelete({ username, name });
        if (!route) {
            return res.status(404).send({ error: "Route non trouvée" });
        }

        return res.status(201).send({ msg: "La route a bien été supprimée." });
    } catch (error) {
        return res.status(500).send({ error });
    }
}

/**
 * Retrieves all routes for a user.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.user - The user object from the token.
 * @param {string} req.user.username - The username of the user.
 * @param {Object} res - The response object.
 *
 * @returns {Promise<void>} Sends an HTTP response containing the user's routes or an error.
 *
 * @throws Will return an HTTP error response if:
 * - No routes are found for the user.
 * - There is a server error during the route retrieval process.
 */
export async function getRoutes(req, res) {
    try {

        // Get the username from the token
        const username = req.user.username;
        // get all the routes for the user
        const routes = await RouteModel.find({ username });
        if (!routes || routes.length === 0) {
            return res.status(404).send({ error: "Aucune route trouvée." });
        }

        return res.status(200).send(routes);
    } catch (error) {
        return res.status(500).send({ error });
    }
}

