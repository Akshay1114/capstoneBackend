import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import {connectDB} from './loaders/db/index.js';
import { router } from './routes/index.js'
import bodyParser from 'body-parser';
import { Notification } from './models/notification.js';
import axios from 'axios';
import passport from 'passport';
import OAuth2Strategy from 'passport-oauth2';
// const querystring = require('querystring');
import querystring from 'querystring';
dotenv.config();
connectDB()
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"],
	allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  },
  transports: ["websocket", "polling"],
  allowEIO3: true,
});
const corsOptions = {
	origin: '*',  
	methods: 'GET,POST,PUT,DELETE',  
	allowedHeaders: 'Content-Type,Authorization',  
  };
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
console.log('process.env.PORT', process.env.PORT)

const users = {}; // Store connected users

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // User joins with their userID
  // socket.on("register", (userID) => {
	// console.log('userID', userID)
  //   users[userID] = socket.id;
  //   console.log(`User ${userID} registered with socket ID: ${socket.id}`);
  // });

  // // Admin sends notification
  // socket.on("send_notification", async ({ message, recipient }) => {
  //   const newNotification = new Notification({ message, recipient });
  //   await newNotification.save();

  //   // Send to a specific user
  //   if (recipient !== "all" && users[recipient]) {
  //     io.to(users[recipient]).emit("receive_notification", message);
  //   } else {
  //     // Send to all users
  //     io.emit("receive_notification", message);
  //   }
  // });

  // socket.on("disconnect", () => {
  //   console.log("User disconnected:", socket.id);
  //   Object.keys(users).forEach((userID) => {
  //     if (users[userID] === socket.id) delete users[userID];
  //   });
  // });


  // NEW with admin and user

  console.log("A user connected:", socket.id);

  // User/Admin registers their socket connection
  socket.on("register", (userID) => {
    users[userID] = socket.id;
    console.log(`User ${userID} registered with socket ID: ${socket.id}`);
  });

  // User sends notification to Admin
  socket.on("send_notification_to_admin", async ({ message, senderID, senderName, scheduleID }) => {
    console.log(`Notification from ${senderName} (${senderID}) to Admin: ${message}`);

    const newNotification = new Notification({ message, recipient: "admin", senderID, senderName, scheduleID });
    await newNotification.save();

    const adminSocketId = users["admin"];
    if (adminSocketId) {
      io.to(adminSocketId).emit("receive_admin_notification", { message, senderID, senderName, scheduleID });
    } else {
      console.log("Admin is offline, notification saved in DB.");
    }
  });

  // Admin sends notification to a specific user or all users
  socket.on("send_notification_to_user", async ({ message, recipient, scheduleID }) => {
    console.log(`Admin sent a notification to ${recipient}: ${message}`);

    const newNotification = new Notification({ message, recipient: recipient, scheduleID });
    await newNotification.save();

    if (recipient === "all") {
      io.emit("receive_notification", { message, sender: "Admin", scheduleID });
    } else if (users[recipient]) {
      io.to(users[recipient]).emit("receive_notification", { message, sender: "Admin",scheduleID });
    } else {
      console.log(`User ${recipient} is offline, notification saved.`);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    Object.keys(users).forEach((userID) => {
      if (users[userID] === socket.id) delete users[userID];
    });
  });
});

app.use(passport.initialize());
passport.use(new OAuth2Strategy({
  authorizationURL: 'https://www.fitbit.com/oauth2/authorize',
  tokenURL: 'https://api.fitbit.com/oauth2/token',
  clientID: process.env.FITBIT_CLIENT_ID,
  clientSecret: process.env.FITBIT_CLIENT_SECRET,
  callbackURL: "http://localhost:5173/auth/fitbit/callback",
  scope: ['sleep', 'activity', 'heartrate', 'profile']
}, (accessToken, refreshToken, profile, done) => {
  return done(null, { accessToken, refreshToken, profile });
}));

app.use(passport.initialize());

// Redirect user to Fitbit for authentication
// app.get('/auth/fitbit', passport.authenticate('oauth2'));
// app.get('/auth/fitbit', (req, res) => {
//   const authUrl = `https://www.fitbit.com/oauth2/authorize?${querystring.stringify({
//       response_type: 'code',
//       client_id: process.env.FITBIT_CLIENT_ID,
//       redirect_uri: process.env.FITBIT_REDIRECT_URI,
//       scope: ['sleep', 'activity', 'heartrate', 'profile'],
//   })}`;
//   res.redirect(authUrl);
// });

// app.get('/auth/fitbit/callback', async (req, res) => {
//   const { code } = req.query;
//   if (!code) return res.status(400).json({ error: 'Authorization code not found' });

//   try {
//       const tokenResponse = await axios.post('https://api.fitbit.com/oauth2/token',
//           querystring.stringify({
//               client_id: process.env.FITBIT_CLIENT_ID,
//               client_secret: process.env.FITBIT_CLIENT_SECRET,
//               grant_type: 'authorization_code',
//               redirect_uri: process.env.FITBIT_REDIRECT_URI,
//               code: code,
//           }),
//           {
//               headers: {
//                   'Content-Type': 'application/x-www-form-urlencoded',
//                   'Authorization': `Basic ${Buffer.from(`${process.env.FITBIT_CLIENT_ID}:${process.env.FITBIT_CLIENT_SECRET}`).toString('base64')}`
//               }
//           }
//       );

//       const { access_token, refresh_token } = tokenResponse.data;

//       const today = new Date();
// const sevenDaysAgo = new Date();
// sevenDaysAgo.setDate(today.getDate() - 6); // Go back 6 days from today

// const startDate = sevenDaysAgo.toISOString().split('T')[0]; // Format: YYYY-MM-DD
// const endDate = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
//       // Step 3: Fetch Sleep Data
//       const sleepResponse = await axios.get(`https://api.fitbit.com/1.2/user/-/sleep/date/${startDate}/${endDate}.json`, {
//         headers: { Authorization: `Bearer ${access_token}` }
//     });

//       res.json({
//           sleepData: sleepResponse.data,
//           accessToken: access_token,
//           refreshToken: refresh_token
//       });

//   } catch (error) {
//       console.error('Error getting Fitbit data:', error.response?.data || error.message);
//       res.status(500).json({ error: 'Failed to obtain access token' });
//   }
// });
// Handle Fitbit OAuth callback
// app.get('/auth/fitbit/callback', passport.authenticate('oauth2', { failureRedirect: '/' }),
//   async (req, res) => {
//       const { accessToken } = req.user;
// console.log('ENTER I N FIT BIT =>>>>>>>')
// console.log('accessToken', accessToken)
//       // Fetch Fitbit sleep data
//       try {
//           const response = await axios.get('https://api.fitbit.com/1.2/user/-/sleep/date/today.json', {
//               headers: { Authorization: `Bearer ${accessToken}` }
//           });
//           console.log('response', response.data)
//           res.json(response.data);
//       } catch (error) {
//           res.status(500).json({ error: 'Failed to fetch Fitbit data' });
//       }
//   });

app.use('/api/', router);

const PORT = process.env.PORT || 5001;
console.log('PORT', PORT)
server.listen(PORT, () => {
	console.log('Server is listening on port ', PORT);
});
// app.listen(PORT, () => {
// 	console.log('Server is listening on port ', 5001);
// });
