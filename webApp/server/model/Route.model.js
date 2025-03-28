/**
 * @fileOverview Routes database model.
 */

import mongoose from "mongoose";

/**
 * Schema definition for the Route model.
 * Represents a route associated with a user, including its details, points, and schedule.
 */
export const RouteSchema = new mongoose.Schema({
    // Username of the user associated with this route
    username: {
        type: String,
        required: true
    },
    // Name of the route
    name: {
        type: String,
        required: true
    },
    // Start adress
    startAdress: {
        type: String,
        required: true
    },
    // End adress
    endAdress: {
        type: String,
        required: true
    },
    // Comment
    comment: {
        type: String,
        required: false
    },
    // Array of points representing the route
    route: {
        type: [
            {
                type: String,
                required: true
            }
        ], // Use an array of strings
        required: true
    },
    // Schedule
    planning: {
        // Use an array of objects to store specific dates
        dates: {
            type: [Date]
        },
        // Use an array of objects to store periodic times
        periodic: {
            type: [
                {
                    // Day of the week (0 for Sunday, 1 for Monday, etc.)
                    dayOfWeek: {
                        type: Number,
                        required: true,
                    },
                    // Time in HH:mm format
                    time: {
                        type: Date,
                        required: true
                    }
                }
            ]
        }
    }
});

// Use the "routes" collection
export default mongoose.model.Routes || mongoose.model('Route', RouteSchema);
