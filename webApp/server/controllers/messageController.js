/**
 * @fileOverview Handles API routes for sending an email when a notification is received.
 */

import UserModel from "../model/User.model.js"

// Mailer function to send the email 
import { sendMail } from '../utils/mailer.js';

/**
 * Sends a message notification email to a user.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request object.
 * @param {string} req.body.username - The username of the recipient.
 * @param {string} req.body.messageContent - The content of the message to include in the email.
 * @param {Object} res - The response object.
 *
 * @returns {Promise<void>} Sends an HTTP response indicating success or failure.
 *
 * @throws Will return an HTTP error response if:
 * - The username is not provided.
 * - The user with the specified username is not found.
 * - There is a server error during the email sending process.
 */
export async function sendMessageNotification(req, res) {
    try {
        /** SEND AN EMAIL */
        // get the username from the request
        const { username, messageContent } = req.body;
        
        // If the username is not set, return an error
        if (!username) return res.status(501).send({ error: "Invalid Username" });

        // Find the user with the username for the email
        UserModel.findOne({ username })
            .then(async user => {
                // If the user is not found, return an error
                if (!user) return res.status(501).send({ error: "Couldn't Find the User" });

                // get the email from the user
                const { email } = Object.assign({}, user.toJSON());

                // Create the email message with the message content
                const message = {
                    body: {
                        name: username,
                        intro: `You have received a new message: "${messageContent}"`,
                        outro: 'Need help, or have questions? Placeholder'
                    }
                };
                console.log("new message", message);
                // Create the email subject
                const subject = "New Message Notification";

                // Send the email with the message content
                await sendMail(email, subject, message);

                // Send the response to the client with a success message
                res.status(201).send({});
            })
            .catch(err => {
                return res.status(500).send({ error: err });
            });
    } catch (error) {
        return res.status(500).send({ error });
    }
}
