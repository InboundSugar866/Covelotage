import UserModel from "../model/User.model.js"

// Mailer function to send the email 
import { sendMail } from '../utils/mailer.js';

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
