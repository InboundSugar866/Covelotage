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
    git clone https://github.com/InboundSugar866/Covelotage.git
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

Create a ``.env`` file in the ``webApp/server`` directory and add the following environment variables (``CLIENT_URL=http://localhost:3000, http://localhost:3001`` in the testing environment):

    PORT= 8080
    JWT_SECRET=YOUR_KEY
    APIKey=YOUR_KEY
    // testing email and password
    EMAIL=Example@email.com
    PASSWORD=Email_password
    MONGODB_URI=mongodb://localhost:27017/covelotage
    MAP_API_URI=https://api.openrouteservice.org
    CLIENT_URL=https://your-production-domain.com
    
Create a ``.env`` file in the ``webApp/client`` directory and add the following environment variables (``http://localhost:8080`` in the testing environment):

    REACT_APP_SERVER_DOMAIN='https://your-production-domain.com'

3. **Start the server:**

Open a new terminal window and run the following commands:

    cd webApp/server
    npm start

4. **Start the client:**

Open a new terminal window and run the following commands:

    cd webApp/client
    npm start

The client application will be available at ``http://localhost:3000``.

## Project Structure

The project is structured as follows:

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
- ``CLIENT_URL``: The URL of the client application, for example: www.covelotage.fr

## Configuration

1. **API configuration**
The ``config.js`` file contains important configuration settings for the application.
- ``JWT_SECRET``: This is a secret key used to sign and verify JSON Web Tokens (JWT). It should be a long, random string that is kept secret. You can generate a new secret key using a secure random string generator.
- ``APIKey``: This is an API key for accessing the OpenRouteService API. You should obtain this key by signing up for an account with OpenRouteService and generating an API key.
- ``EMAIL``: This should be the email address you want to use to send emails from your application. Using the ethereal service during testing.
- ``PASSWORD``: This should be the password for the email account specified in the ``EMAIL`` field.
- ``CLIENT_URL``: This is the accepted addresses for the CORS policy. Change this to the address of the website once it is deployed. Currently, it accepts only two parallel sessions.

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
Make sure to visit https://www.mongodb.com/cloud/atlas/register to have access to a cloud database or serve one locally on the server.

2. **Configure environment variables:**

Ensure all environment variables (.env) are set correctly for the production environment.

3. **Build the client application:**

```bash
cd webApp/client
npm run build
```

This will create a ``build`` directory with the production build of the client application.

4. **Serve the client application:**

Use a static file server (e.g., Nginx, Apache) to serve the files in the ``build`` directory.
For example in Nginx:
```
server {
    listen 80;
    server_name www.covelotage.fr;

    # Redirect all HTTP requests to HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name www.covelotage.frc;

    # SSL configuration
    ssl_certificate /etc/letsencrypt/live/covelotage.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/covelotage.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Serve React frontend
    root /var/www/covelotage/client/build;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    # Proxy API requests to Node.js backend running from /server/server.js
    location /api/ {
        proxy_pass http://localhost:8080/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket support for /socket.io
    location /socket.io/ {
        proxy_pass http://localhost:8080/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";
}

```

5. **Start the server:**

Ensure the server is running with the correct environment variables.
Install Certbot and configure SSL on a linux server:
```
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d www.covelotage.fr
```

6. **Configure WebSocket server:**

Ensure the WebSocket server is configured correctly and running.
Ensure WebSocket initialization is handled in server.js and uses wss:// protocol when HTTPS is enabled.

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
