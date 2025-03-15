/**
 * @fileOverview Utility functions for sending emails using nodemailer and Mailgen.
 * Configures email transport and generates email content for delivery.
 */

import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';
//import ENV from '../config.js';
import dotenv from 'dotenv';
dotenv.config();

const email = process.env.EMAIL;
const password = process.env.PASSWORD;

// NodeMailer configuration
// https://ethereal.email/create
let nodeConfig = {
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: email, // generated ethereal user
        pass: password, // generated ethereal password
    }
};

/** Create a transporter for sending emails */
let transporter = nodemailer.createTransport(nodeConfig);

/** Create a mail generator for generating email content */
let MailGenerator = new Mailgen({
    theme: "default",
    product: {
        name: "Mailgen",
        link: 'https://mailgen.js/',
    },
});

/**
 * Sends an email to the specified user.
 * @param {string} userEmail - The recipient's email address.
 * @param {string} subject - The subject of the email.
 * @param {Object} message - The message content to be included in the email body.
 * @returns {Promise<void>} A promise indicating the success or failure of the email sending process.
 */
export async function sendMail(userEmail, subject, message) {
    try {
        // Generate the email body using Mailgen
        const emailBody = MailGenerator.generate(message);

        // Configure the email details
        const email = {
            from: email,
            to: userEmail,
            subject: subject,
            html: emailBody,
        };

        // Send the email using the transporter
        await transporter.sendMail(email);
        console.log("Email sent");
        return Promise.resolve();
    } catch (error) {
        console.error(error);
        return Promise.reject(error);
    }
}