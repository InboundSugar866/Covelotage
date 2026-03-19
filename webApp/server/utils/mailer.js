/**
 * @fileOverview Utility functions for sending emails using nodemailer and Mailgen.
 * Configures email transport and generates email content for delivery.
 */

import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';
import dotenv from 'dotenv';
dotenv.config();

const senderemail = process.env.EMAIL || 'no-reply@covelotage.local';
const password = process.env.PASSWORD;

/** Create a mail generator for generating email content */
let MailGenerator = new Mailgen({
    theme: 'default',
    product: {
        name: 'Mailgen',
        link: 'https://mailgen.js/',
    },
});

/**
 * Sends an email to the specified user. If SMTP credentials are not configured, this
 * function will create a disposable Ethereal account (for development) and use it.
 * It will return the nodemailer info and, when using Ethereal, log a preview URL.
 */
export async function sendMail(userEmail, subject, message) {
    try {
        // Generate HTML body
        const emailBody = MailGenerator.generate(message);

        // Build transporter config depending on env
        let transporter;

            if (senderemail && password) {
            // Use configured SMTP server
            transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST || 'smtp.ethereal.email',
                port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
                secure: process.env.SMTP_SECURE === 'true' || false,
                auth: { user: senderemail, pass: password },
            });
        } else {
                // No SMTP credentials provided: create a lightweight JSON transport for local development.
                // This avoids external dependencies but keeps template rendering intact. When real
                // SMTP credentials are provided in the .env (EMAIL/PASSWORD and optionally SMTP_HOST/PORT),
                // the same code will use them automatically.
                transporter = nodemailer.createTransport({ jsonTransport: true });
                console.log('No SMTP credentials provided — using JSON transport (development). Set EMAIL and PASSWORD in .env for real SMTP.');
        }

        const email = {
            from: senderemail || 'no-reply@example.com',
            to: userEmail,
            subject,
            html: emailBody,
        };

        const info = await transporter.sendMail(email);

        // If using Ethereal or a test account, nodemailer.getTestMessageUrl(info) returns a preview URL.
        const previewUrl = nodemailer.getTestMessageUrl ? nodemailer.getTestMessageUrl(info) : null;
        if (previewUrl) console.log('Preview URL: %s', previewUrl);

        console.log('Email sent: %s', info.messageId || '(no messageId)');
        return Promise.resolve(info);
    } catch (error) {
        console.error('sendMail error:', error);
        return Promise.reject(error);
    }
}