import mongoose from "mongoose";
//const mongoose = require('mongoose');

import { MongoMemoryServer } from "mongodb-memory-server";
//const { MongoMemoryServer } = require("mongodb-memory-server");
import ENV from '../config.js'
//const ENV = require('../config.js');

async function connect() {
    // const mongod = await MongoMemoryServer.create(); // décommenter pour simuler la bdd
    // const getUri = mongod.getUri(); // décommenter pour simuler la bdd

    mongoose.set('strictQuery', true);
    // const db = await mongoose.connect(getUri); // décommenter pour simuler la bdd
    const db = await mongoose.connect(ENV.MONGODB_URI); // commenter pour simuler la bdd

    console.log("Database Connected");
    return db;
}

export default connect;
//module.exports = connect;