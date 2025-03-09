import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createRequire } from 'module';
import connect from './database/conn.js';
import router from './router/route.js';
import User from './model/User.model.js';
import Message from './model/Message.model.js';
import ENV from './config.js';

// Mailer function to send the email 
import { sendMail } from './utils/mailer.js';
import UserModel from "./model/User.model.js"

dotenv.config();

const app = express();
const port = 8080;
const jwtSecret = ENV.JWT_SECRET || 'your_jwt_secret';
const bcryptSalt = bcrypt.genSaltSync(10);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware
app.use(express.json({ limit: '5mb' }));
app.use(cors({
  credentials: true,
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (ENV.CLIENT_URL.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));
app.use(morgan('tiny'));
app.disable('x-powered-by');
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.status(201).json("Home GET Request");
});

app.use('/api', router);

const server = app.listen(port, () => {
  console.log(`Server connected to http://localhost:${port}`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.log(`Port ${port} is already in use.`);
  } else {
    console.log('Cannot connect to the server:', error);
  }
});

connect().then(() => {
  console.log("Database connected successfully");
}).catch(error => {
  console.log("Invalid database connection...!", error);
});

const require = createRequire(import.meta.url);
const WebSocket = require('ws');
const wss = new WebSocket.Server({ noServer: true });

server.on('upgrade', function upgrade(request, socket, head) {
  wss.handleUpgrade(request, socket, head, function done(ws) {
    wss.emit('connection', ws, request);
  });
});

wss.on('connection', (connection, req) => {
  function notifyAboutOnlinePeople() {
    const onlineClients = [...wss.clients].map(c => ({ userId: c.userId, username: c.username }));
    [...wss.clients].forEach(client => {
      client.send(JSON.stringify({ online: onlineClients }));
    });
  }

  connection.isAlive = true;
  connection.timer = setInterval(() => {
    connection.ping();
    connection.deathTimer = setTimeout(() => {
      connection.isAlive = false;
      clearInterval(connection.timer);
      connection.terminate();
      notifyAboutOnlinePeople();
      console.log('dead');
    }, 1000);
  }, 5000);

  connection.on('pong', () => {
    clearTimeout(connection.deathTimer);
  });

  const cookies = req.headers.cookie;
  if (cookies) {
    const tokenCookieString = cookies.split(';').find(str => str.trim().startsWith('token='));
    if (tokenCookieString) {
      const token = tokenCookieString.split('=')[1];
      if (token) {
        jwt.verify(token, jwtSecret, (err, userData) => {
          if (err) throw err;
          connection.userId = userData.userId;
          connection.username = userData.username;
        });
      }
    }
  }

  connection.on('message', async (message) => {
    const messageData = JSON.parse(message.toString());
    const { recipient, text, file } = messageData;
    let filename = null;

    if (file) {
      console.log('size', file.data.length);
      const parts = file.name.split('.');
      const ext = parts[parts.length - 1];
      filename = `${Date.now()}.${ext}`;
      const path = `${__dirname}/uploads/${filename}`;
      const bufferData = Buffer.from(file.data.split(',')[1], 'base64');
      fs.writeFile(path, bufferData, () => {
        console.log(`file saved: ${path}`);
      });
    }

    if (recipient && (text || file)) {
      const messageDoc = await Message.create({
        sender: connection.userId,
        recipient,
        text,
        file: file ? filename : null,
      });

      console.log('created message');
      [...wss.clients]
        .filter(c => c.userId === recipient)
        .forEach(c => c.send(JSON.stringify({
          text,
          sender: connection.userId,
          recipient,
          file: file ? filename : null,
          _id: messageDoc._id,
        })));

      // Email notification logic
      UserModel.findOne({ _id: recipient })
      .then(async user => {
          if (user) {
              const { email } = user;
              const message = {
                  body: {
                      name: user.username,
                      intro: `You have received a new message from ${connection.username}: "${text || 'You have received a file.'}"`,
                      outro: 'Need help, or have questions? Placeholder'
                  }
              };
              const subject = "New Message Notification";
              console.log('Sending email notification to:', email); // Debugging log
              await sendMail(email, subject, message);
              console.log('Email notification sent successfully'); // Debugging log
          }
      })
      .catch(err => {
          console.error('Error finding user for email notification:', err);
      });
    }
  });

  notifyAboutOnlinePeople();
});

app.get('/messages/:userId', async (req, res) => {
  const { userId } = req.params;
  const userData = await getUserDataFromRequest(req);
  const ourUserId = userData.userId;
  const messages = await Message.find({
    sender: { $in: [userId, ourUserId] },
    recipient: { $in: [userId, ourUserId] },
  }).sort({ createdAt: 1 });
  res.json(messages);
});

app.get('/people', async (req, res) => {
  const users = await User.find({}, { '_id': 1, username: 1 });
  res.json(users);
});

app.get('/profile', (req, res) => {
  const token = req.cookies?.token;
  if (token) {
    jwt.verify(token, jwtSecret, (err, userData) => {
      if (err) throw err;
      res.json(userData);
    });
  } else {
    res.status(401).json('no token');
  }
});

async function getUserDataFromRequest(req) {
  return new Promise((resolve, reject) => {
    const token = req.cookies?.token;
    if (token) {
      jwt.verify(token, jwtSecret, (err, userData) => {
        if (err) return reject(err);
        resolve(userData);
      });
    } else {
      reject('no token');
    }
  });
}
