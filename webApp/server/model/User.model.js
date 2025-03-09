/**
 * @fileOverview Users database model.
 */

import mongoose from "mongoose";

/**
 * Schema definition for the User model.
 * Represents user data including personal details, credentials, and profile information.
 */
export const UserSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, "Please provide your name"],
        unique : false
    },
    surname : {
        type : String,
        required : [true, "Please provide you last name"],
        unique : false
    },
    username : {
        type : String,
        required : [true, "Please provide unique Username"],
        unique : [true, "Username Exist"]
    },
    phone : {
        type : String,
        required : [true, "Please provide your phone number"],
        unique : false
    },
    street : {
        type : String,
        required : [true, "Please provide your adress"],
        unique : false
    },
    postCode : {
        type : String,
        required : [true, "Please provide your adress"],
        unique : false
    },
    city : {
        type : String,
        required : [true, "Please provide your adress"],
        unique : false
    },
    password : {
        type : String,
        required : [true, "Please provide a password"],
        unique : false
    },
    email : {
        type: String,
        required : [true, "Please provide a unique email"],
        unique: true
    },
    created : {
        type: String,
        required : [false, "Date created"],
        unique: false
    },
    name : { type: String},
    surname : { type: String},
    phone : { type : String},
    street : { type: String},
    postCode : { type: String},
    city : { type: String},
    profile : { type: String},
    created : { type: String}
});

// Use the existing model; otherwise, use the new one
export default mongoose.model.Users || mongoose.model('User', UserSchema);