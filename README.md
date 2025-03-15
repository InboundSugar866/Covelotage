# Covelotage Application

Covelotage is a web application designed to facilitate bicycle carpooling by connecting cyclists with similar routes. This README provides detailed instructions on how to set up, run, and deploy the Covelotage application.
The entire documentation for all the functions is available in the ``Documentation`` folder, opening the ``index.html`` file.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application Locally](#running-the-application-locally)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [API Endpoints](#api-endpoints)
- [WebSocket Configuration](#websocket-configuration)
- [License](#license)

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- Node.js (v14.x or higher)
- npm (v6.x or higher)
- MongoDB (v4.x or higher)
- Git

## Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/covelotage.git
    cd covelotage
    ```

2. **Install server dependencies:**

    ```bash
    cd webApp/server
    npm install
    ```
2. **Install client dependencies:**

    ```bash
    cd ../client
    npm install
    ```

## Running the Application Locally

1. **Start MongoDB:**

Ensure MongoDB is running on your local machine. You can start MongoDB using the following command:

```bash
mongod
```

2. **Configure environment variables:**

Create a ``.env`` file in the ``webApp/server`` directory and add the following environment variables:
    ```bash

    PORT=8080
    MONGO_URI=mongodb://localhost:27017/covelotage
    JWT_SECRET=your_jwt_secret
    MAP_API_URI=https://api.openrouteservice.org
    APIKey=your_openrouteservice_api_key
    CLIENT_URL=http://localhost:3000
    

3. **Start the server:**

Open a new terminal window and run the following commands:
    ```bash

    cd webApp/server
    npm start

4. **Start the client:**

Open a new terminal window and run the following commands:
    ```bash

    cd webApp/client
    npm start

The client application will be available at ``http://localhost:3000``.

## Project Structure

The project is structured as follows:
    ```tree

    covelotage/
    ├── webApp/
    │   ├── client/
    │   │   ├── public/
    │   │   ├── src/
    │   │   │   ├── assets/
    │   │   │   ├── components/
    │   │   │   ├── hooks/
    │   │   │   ├── pages/
    │   │   │   ├── store/
    │   │   │   ├── helper/
    │   │   │   ├── middleware/
    │   │   │   ├── App.js
    │   │   │   └── index.js
    │   │   ├── package.json
    │   │   └── ...
    │   ├── server/
    │   │   ├── config.js
    │   │   ├── controllers/
    │   │   ├── database/
    │   │   ├── model/
    │   │   ├── router/
    │   │   ├── utils/
    │   │   ├── server.js
    │   │   └── ...
    │   ├── package.json
    │   └── ...
    └── README.md
    
## Environment Variables

The application requires the following environment variables:

- ``PORT``: The port on which the server will run.
- ``MONGO_URI``: The MongoDB connection string.
- ``JWT_SECRET``: The secret key for JWT authentication.
- ``MAP_API_URI``: The base URL for the OpenRouteService API.
- ``APIKey``: The API key for the OpenRouteService API.
- ``CLIENT_URL``: The URL of the client application.

## Configuration

1. **API confifiguration**
The ``config.js`` file contains important configuration settings for the application.
- ``JWT_SECRET``: This is a secret key used to sign and verify JSON Web Tokens (JWT). It should be a long, random string that is kept secret. You can generate a new secret key using a secure random string generator.
- ``APIKey``: This is an API key for accessing the OpenRouteService API. You should obtain this key by signing up for an account with OpenRouteService and generating an API key.
- ``EMAIL``: This should be the email address you want to use to send emails from your application. Using the ethereal service during testing.
- ``PASSWORD``: This should be the password for the email account specified in the ``EMAIL`` field.
- ``CLIENT_URL``: This is the accepted addresses for the CORS policy. Change this to the address of the website once it is deployed. Currently, it accepts only two parallel sessions.

For security reasons, you should not use the example values provided in the config.js file. Instead, generate your own secure values. For a production environment, you should use a secure email service provider and generate an app-specific password if possible. Do not use your personal email credentials directly.

Below is an example configuration:

    // filepath: Covelotage\webApp\server\config.js
    export default {
        JWT_SECRET : "YOUR_KEY",
        APIKey : "YOUR_KEY",
        // testing email and password
        EMAIL : "Example@email.com",
        PASSWORD : "Email_password",
        MONGODB_URI : "mongodb://localhost:27017/covelotage",
        MAP_API_URI : "https://api.openrouteservice.org",
        CLIENT_URL: ["http://localhost:3000", "http://localhost:3001"]
    }

2. **Mailer configuration**

The ``mailer.js`` file contains the configuration for sending emails using NodeMailer with an ethereal confuguration for testing purposes. Below is an example configuration:

    // filepath: Covelotage\webApp\server\utils\mailer.js
    // NodeMailer configuration
    let nodeConfig = {
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: ENV.EMAIL, // generated ethereal user
            pass: ENV.PASSWORD, // generated ethereal password
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

You can find all the sample emails sent to the user (for OTP, upon receiving an email) in ``server\controllers\.``.

## Deployment

To deploy the Covelotage application in a real environment, follow these steps:

1. **Set up a production database:**

Ensure you have a production MongoDB instance and update the ``MONGO_URI`` environment variable accordingly.

2. **Configure environment variables:**

Ensure all environment variables are set correctly for the production environment.

3. **Build the client application:**

```bash
cd webApp/client
npm run build
```

This will create a ``build`` directory with the production build of the client application.

4. **Serve the client application:**

Use a static file server (e.g., Nginx, Apache) to serve the files in the ``build`` directory.

5. **Start the server:**

Ensure the server is running with the correct environment variables.

6. **Configure WebSocket server:**

Ensure the WebSocket server is configured correctly and running.

## API Endpoints

The server exposes the following API endpoints:
- ``GET /``: Home route to verify the server is operational.
- ``POST /api/shortestPath``: Computes the shortest path based on provided coordinates.
- ``POST /api/findMatches``: Finds matching routes from the database that align with a user's route.
- ``GET /messages/``:userId: Fetches messages between users.
- ``GET /people``: Fetches all users.
- ``GET /profile``: Fetches user profile based on token.

## WebSocket Configuration

The application uses WebSocket for real-time communication. The WebSocket server is set up in the ``server.js`` file and handles connections, messages, and notifications.

## License

This project is licensed under the MIT License.