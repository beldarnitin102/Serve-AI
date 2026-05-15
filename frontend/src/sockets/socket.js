import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000', {
  autoConnect: false,
});

let pendingJoinData = null;

socket.on('connect', () => {
  console.log('Socket connected:', socket.id);
  if (pendingJoinData) {
    socket.emit('join', pendingJoinData);
  }
});

socket.on('disconnect', (reason) => {
  console.log('Socket disconnected:', reason);
});

socket.on('connect_error', (error) => {
  console.error('Socket connect error:', error);
});

export const connectSocket = ({ userId, role }) => {
  const joinData = { userId, role };
  pendingJoinData = joinData;

  if (!socket.connected) {
    socket.connect();
  } else if (userId) {
    socket.emit('join', joinData);
  }
};

export const disconnectSocket = () => {
  pendingJoinData = null;
  if (socket.connected) {
    socket.disconnect();
  }
};

export const subscribeToBookingUpdates = (callback) => {
  socket.on('booking_status_changed', callback);
  socket.on('booking_update', callback);
  return () => {
    socket.off('booking_status_changed', callback);
    socket.off('booking_update', callback);
  };
};

export const subscribeToNewBookings = (callback) => {
  socket.on('new_booking', callback);
  return () => socket.off('new_booking', callback);
};

export const subscribeToWorkerLocation = (callback) => {
  socket.on('worker_location', callback);
  return () => socket.off('worker_location', callback);
};

export const subscribeToMessages = (callback) => {
  socket.on('receive_message', callback);
  return () => socket.off('receive_message', callback);
};

export const subscribeToNotifications = (callback) => {
  socket.on('new_notification', callback);
  return () => socket.off('new_notification', callback);
};

export const emitBookingUpdate = (data) => {
  socket.emit('booking_update', data);
};

export const emitLocationUpdate = (data) => {
  socket.emit('location_update', data);
};

export const emitMessage = (data) => {
  socket.emit('send_message', data);
};

export default socket;