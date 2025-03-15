/**
 * @fileOverview Middleware to authenticate, authorize and manage sessions for the user.
 */

import jwt from 'jsonwebtoken';
//import env from '../config.js'

/**
 * Middleware to authenticate and authorize user requests based on the provided token.
 *
 * @async
 * @function Auth
 * @param {Object} req - The request object.
 * @param {Object} req.headers - The headers of the request.
 * @param {string} req.headers.authorization - The authorization header containing the token.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @throws {Error} Returns a 401 status with an error message if authentication fails.
 */
export default async function Auth(req, res, next){
    try {        
        // access authorize header to validate request
        const token = req.headers.authorization.split(" ")[1];

        // retrieve the user details fo the logged in user
        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedToken;

        next()
    } catch (error) {
        res.status(401).json({ error : "Authentication échouée!"})
    }
}

/**
 * Middleware to create local variables for the application, used when generating OTP or managing sessions.
 *
 * @function localVariables
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
export function localVariables(req, res, next){
    req.app.locals = {
        OTP : null,
        resetSession : false
    }
    next()
}