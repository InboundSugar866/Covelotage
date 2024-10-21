import mongoose from "mongoose";

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
        type : Number,
        required : [true, "Please provide your phone number"],
        unique : false
    },
    address : {
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
    name : { type: String},
    surname : { type: String},
    phone : { type : Number},
    address : { type: String},
    profile : { type: String},

});

// Use the existing model; otherwise, use the new one
export default mongoose.model.Users || mongoose.model('User', UserSchema);