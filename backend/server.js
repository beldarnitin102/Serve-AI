import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import axios from "axios";

import connectDB from "./config/database.js";
import authRoutes from "./routes/auth.js";
import bookingRoutes from "./routes/bookings.js";
import workerRoutes from "./routes/workers.js";
import adminRoutes from "./routes/admin.js";
import aiRoutes from "./routes/ai.js";
import emergencyRoutes from "./routes/emergency.js";
import notificationRoutes from "./routes/notifications.js";
import chatRoutes from "./routes/chat.js";

import { initSocket } from './socket/socket.js';

dotenv.config();

const app = express();
const server = createServer(app);
const io = initSocket(server);

app.set('io', io);

// =======================
// DATABASE
// =======================
connectDB();

// =======================
// MIDDLEWARE
// =======================
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =======================
// TEST ROUTE
// =======================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "ServAI Backend Running Successfully",
  });
});

// =======================
// AUTH ROUTES
// =======================
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/emergency", emergencyRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/chat", chatRoutes);

// =======================
// AI CHAT ROUTE
// =======================
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",

        messages: [
          {
            role: "system",
            content:
              "You are a helpful AI assistant for ServAI, a smart urban home services platform.",
          },
          {
            role: "user",
            content: message,
          },
        ],

        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      reply: response.data.choices[0].message.content,
    });
  } catch (error) {
    console.log("AI ERROR:", error.response?.data || error.message);

    res.status(500).json({
      error: error.response?.data || error.message,
    });
  }
});

// Socket logic is now handled in socket/socket.js

// =======================
// SERVER
// =======================
import { exec } from 'child_process';

const PORT = process.env.PORT || 5000;

const startServer = () => {
  server.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`⚠️ Port ${PORT} is in use. Attempting to kill the blocking process...`);
      exec(`netstat -ano | findstr :${PORT} | findstr LISTENING`, (error, stdout) => {
        if (!error && stdout) {
          const lines = stdout.trim().split('\n');
          const pid = lines[0].trim().split(/\s+/).pop();
          if (pid) {
            exec(`taskkill /F /PID ${pid}`, (killErr) => {
              if (!killErr) {
                console.log(`✅ Killed process ${pid}. Restarting server...`);
                setTimeout(startServer, 1000);
              } else {
                console.error(`❌ Failed to kill process ${pid}. Please kill it manually.`);
                process.exit(1);
              }
            });
          }
        } else {
          console.error(`❌ Could not find process blocking port ${PORT}.`);
          process.exit(1);
        }
      });
    } else {
      console.error('Server error:', err);
    }
  });
};

startServer();