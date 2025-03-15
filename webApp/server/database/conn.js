/**
 * @fileOverview Connection to the MongoDB database.
 */

import mongoose from "mongoose";

import { MongoMemoryServer } from "mongodb-memory-server";
//import env from '../config.js'

/**
 * Connects to the MongoDB database using the provided URI from the environment configuration.
 * If testing, uncomment the lines to use MongoMemoryServer for an in-memory database.
 *
 * @async
 * @function connect
 * @returns {Promise<mongoose.Connection>} The mongoose connection object.
 */
async function connect() {
    //const mongod = await MongoMemoryServer.create(); // décommenter pour simuler la bdd
    //const getUri = mongod.getUri(); // décommenter pour simuler la bdd

    mongoose.set('strictQuery', true);
    //const db = await mongoose.connect(getUri); // décommenter pour simuler la bdd
    const db = await mongoose.connect(process.env.MONGODB_URI); // commenter pour simuler la bdd

    console.log("Database Connected");
    return db;
}

export default connect;