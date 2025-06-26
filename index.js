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
// import querystring from 'querystring'; // ❌ remove if unused

dotenv.config();

// ✅ App setup
const app = express();
const server = http.createServer(app); // ✅ create HTTP server for Socket.IO

// ✅ CORS options
const corsOptions = {
  origin: '*',
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api/userHealth', healthController);

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/kicks", kickRoutes);
app.use('/api/userHealth', weightController);
app.use("/api", router);

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

// ✅ Start Server
const startServer = async () => {
  await connectDB();

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();
