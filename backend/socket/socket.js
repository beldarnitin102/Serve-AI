import { Server } from 'socket.io';

let io;
const connectedUsers = new Map(); // userId -> socketId

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('✅ Socket connected:', socket.id);

    socket.on('join', (userId) => {
      connectedUsers.set(userId, socket.id);
      socket.join(userId);
      console.log(`👤 User ${userId} joined their private room`);

      // Special room for admins
      // In real app, verify role from token
      if (userId === 'admin' || userId.includes('admin')) {
        socket.join('admin');
        console.log('👑 Admin joined live monitoring room');
      }
    });

    socket.on('disconnect', () => {
      // Find and remove user from map
      for (const [userId, socketId] of connectedUsers.entries()) {
        if (socketId === socket.id) {
          connectedUsers.delete(userId);
          break;
        }
      }
      console.log('❌ Socket disconnected:', socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

export const emitToUser = (userId, event, data) => {
  if (io) {
    io.to(userId).emit(event, data);
    // Broadcast to admin room for live monitoring
    io.to('admin').emit(event, data);
  }
};

export const emitToAllWorkers = (event, data) => {
  if (io) {
    // In a real app, you might join workers to a 'workers' room
    io.emit(event, data);
  }
};
