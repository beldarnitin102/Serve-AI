import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./config/database.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// Existing chat route
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    console.log("USER MESSAGE:", message);

    console.log(
      "API KEY EXISTS:",
      !!process.env.GROQ_API_KEY
    );

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",

        messages: [
          {
            role: "system",
            content:
              "You are a helpful AI assistant for ServAI, a smart urban home services platform. Help users with booking services, answering questions about available services, and providing information about workers and pricing.",
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

    console.log("AI SUCCESS");

    res.json({
      reply:
        response.data.choices[0].message.content,
    });
  } catch (error) {
    console.log("===== ERROR =====");

    console.log(error.response?.data);

    res.status(500).json({
      error:
        error.response?.data || error.message,
    });
  }
});

// Socket.io for real-time features
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join user room
  socket.on('join', (userId) => {
    socket.join(userId);
  });

  // Handle booking updates
  socket.on('booking_update', (data) => {
    io.to(data.userId).emit('booking_status_changed', data);
    if (data.workerId) {
      io.to(data.workerId).emit('new_booking', data);
    }
  });

  // Handle location updates
  socket.on('location_update', (data) => {
    socket.to(data.bookingId).emit('worker_location', data);
  });

  // Handle chat messages
  socket.on('send_message', (data) => {
    io.to(data.receiverId).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});