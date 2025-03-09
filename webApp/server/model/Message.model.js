/**
 * @fileOverview Messages database model.
 */

import mongoose from "mongoose";

/**
 * Message schema definition.
 * Represents a message in the database, including sender, recipient, text, and optional file attachment.
 */
const MessageSchema = new mongoose.Schema({
  sender: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  recipient: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  text: String,
  file: String,
}, {timestamps:true});

export default mongoose.model.Message || mongoose.model('Message', MessageSchema);