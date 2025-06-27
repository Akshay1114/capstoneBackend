// ✅ Imports
import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { connectDB } from './loaders/db/index.js';
import { router } from './routes/index.js';
import { authRoutes } from './routes/authRoutes.js';
import { Notification } from './models/notification.js';
import kickRoutes from "./routes/kickRoutes.js";
import { healthController } from './controllers/healthController.js';
import { weightController } from './controllers/weightAnalyse.js';
import axios from 'axios';

import mongoose from 'mongoose';
// import querystring from 'querystring'; // ❌ remove if unused

dotenv.config();

// ✅ App setup
const app = express();

const server = http.createServer(app);
app.use(express.json({ limit: '100mb' }));

connectDB();

// ✅ CORS options
const corsOptions = {
  origin: '*',
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



app.use('/api/userHealth', weightController);

app.use("/api/", router);
app.use("/api/auth", authRoutes);
app.use("/api/kicks", kickRoutes);


// ✅ Socket.IO Setup
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
  allowEIO3: true,
});

const users = {};

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("register", (userID) => {
    users[userID] = socket.id;
    console.log(`User ${userID} registered with socket ID: ${socket.id}`);
  });

  socket.on("send_notification_to_admin", async ({ message, senderID, senderName, scheduleID }) => {
    const newNotification = new Notification({ message, recipient: "admin", senderID, senderName, scheduleID });
    await newNotification.save();

    const adminSocketId = users["admin"];
    if (adminSocketId) {
      io.to(adminSocketId).emit("receive_admin_notification", { message, senderID, senderName, scheduleID });
    }
  });

  socket.on("send_notification_to_user", async ({ message, recipient, scheduleID }) => {
    const newNotification = new Notification({ message, recipient, scheduleID });
    await newNotification.save();

    if (recipient === "all") {
      io.emit("receive_notification", { message, sender: "Admin", scheduleID });
    } else if (users[recipient]) {
      io.to(users[recipient]).emit("receive_notification", { message, sender: "Admin", scheduleID });
    }
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
    Object.keys(users).forEach((userID) => {
      if (users[userID] === socket.id) delete users[userID];
    });
  });
});


// mongoose
//   .connect(process.env.URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("✅ MongoDB Atlas connected successfully");
//     server.listen(process.env.PORT || 5001, () => {
//       console.log("🚀 Server running on port", process.env.PORT || 5001);
//     });
//   })
//   .catch((err) => {
//     console.error("❌ MongoDB connection error:", err.message);
//   });

const PORT = process.env.PORT || 5001;
console.log('PORT', PORT)
server.listen(PORT, () => {
  console.log('Server is listening on port ', PORT);
});
// -----------------------------------------
// 🟡 FITBIT OAUTH2 INTEGRATION (COMMENTED)
// -----------------------------------------

// Redirect user to Fitbit for authentication
// app.get('/auth/fitbit', (req, res) => {
//   const authUrl = `https://www.fitbit.com/oauth2/authorize?${querystring.stringify({
//     response_type: 'code',
//     client_id: process.env.FITBIT_CLIENT_ID,
//     redirect_uri: process.env.FITBIT_REDIRECT_URI,
//     scope: ['sleep', 'activity', 'heartrate', 'profile'],
//   })}`;
//   res.redirect(authUrl);
// });

// Fitbit callback route: exchanges code for token and fetches sleep data
// app.get('/auth/fitbit/callback', async (req, res) => {
//   const { code } = req.query;
//   if (!code) return res.status(400).json({ error: 'Authorization code not found' });

//   try {
//     const tokenResponse = await axios.post('https://api.fitbit.com/oauth2/token',
//       querystring.stringify({
//         client_id: process.env.FITBIT_CLIENT_ID,
//         client_secret: process.env.FITBIT_CLIENT_SECRET,
//         grant_type: 'authorization_code',
//         redirect_uri: process.env.FITBIT_REDIRECT_URI,
//         code: code,
//       }),
//       {
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//           'Authorization': `Basic ${Buffer.from(`${process.env.FITBIT_CLIENT_ID}:${process.env.FITBIT_CLIENT_SECRET}`).toString('base64')}`
//         }
//       }
//     );

//     const { access_token, refresh_token } = tokenResponse.data;

//     // 🗓 Calculate date range: last 7 days
//     const today = new Date();
//     const sevenDaysAgo = new Date();
//     sevenDaysAgo.setDate(today.getDate() - 6);

//     const startDate = sevenDaysAgo.toISOString().split('T')[0];
//     const endDate = today.toISOString().split('T')[0];

//     // Step 3: Fetch sleep data for date range
//     const sleepResponse = await axios.get(
//       `https://api.fitbit.com/1.2/user/-/sleep/date/${startDate}/${endDate}.json`,
//       { headers: { Authorization: `Bearer ${access_token}` } }
//     );

//     res.json({
//       sleepData: sleepResponse.data,
//       accessToken: access_token,
//       refreshToken: refresh_token
//     });

//   } catch (error) {
//     console.error('❌ Error getting Fitbit data:', error.response?.data || error.message);
//     res.status(500).json({ error: 'Failed to obtain access token' });
//   }
// });

app.post('/api/chatWithBot', async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== 'string' || message.trim() === '') {
    return res.status(400).json({ error: 'Message is required and must be non-empty' });
  }

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-70b-8192',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: message }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        }
      }
    );

    const reply = response.data.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error('Groq API Error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch reply from Groq' });
  }
});
