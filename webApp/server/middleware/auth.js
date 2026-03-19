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

/**
 * Middleware to ensure the current user is an admin.
 */
export async function ensureAdmin(req, res, next) {
    try {
        // req.user should already be set by Auth middleware
        if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
        // If token payload contains isAdmin flag, accept; otherwise reject
        if (req.user.isAdmin) return next();
        // Try to decode token again to read full payload if required
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded && decoded.isAdmin) return next();
        return res.status(403).json({ error: 'Forbidden: admin only' });
    } catch (err) {
        return res.status(403).json({ error: 'Forbidden: admin only' });
    }
}