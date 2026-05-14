import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  verifyOTP: (data) => api.post('/auth/verify-otp', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Chat API
export const chatAPI = {
  getMessages: (bookingId) => api.get(`/chat/${bookingId}`),
  sendMessage: (data) => api.post('/chat', data),
};

// Booking API
export const bookingAPI = {
  createBooking: (data) => api.post('/bookings', data),
  getUserBookings: () => api.get('/bookings/user'),
  getWorkerBookings: () => api.get('/bookings/worker'),
  updateBookingStatus: (id, status) => api.put(`/bookings/${id}/status`, { status }),
  getBookingById: (id) => api.get(`/bookings/${id}`),
  claimGuarantee: (id, reason) => api.post(`/bookings/${id}/claim-guarantee`, { reason }),
  submitReview: (id, data) => api.post(`/bookings/${id}/review`, data),
};

// Worker API
export const workerAPI = {
  getAvailableWorkers: (service, location) => api.get('/workers/available-workers', { params: { service, location } }),
  updateLocation: (location) => api.put('/workers/location', location),
  updateAvailability: (availability) => api.put('/workers/availability', availability),
  getWorkerProfile: () => api.get('/workers/profile'),
  updateWorkerProfile: (data) => api.put('/workers/profile', data),
  verifyProfile: (formData) => api.post('/workers/verify-profile', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getAvailableJobs: () => api.get('/workers/available-jobs'),
  acceptJob: (jobId) => api.post(`/workers/accept/${jobId}`),
  startService: (data) => api.post('/workers/start-service', data),
  completeService: (data) => api.post('/workers/complete-service', data),
  getAssistant: () => api.get('/workers/assistant')
};

// Emergency API
export const emergencyAPI = {
  sendSOS: (data) => api.post('/emergency/sos', data)
};

// Admin API
export const adminAPI = {
  getAllUsers: () => api.get('/admin/users'),
  getAllWorkers: () => api.get('/admin/workers'),
  getAllBookings: () => api.get('/admin/bookings'),
  getAnalytics: () => api.get('/admin/analytics'),
  updateUserStatus: (id, status) => api.put(`/admin/users/${id}/status`, { status }),
  getEmergencyRequests: () => api.get('/admin/emergency'),
};

// Notification API
export const notificationAPI = {
  getAll: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
};

// AI API
export const aiAPI = {
  getWorkerMatches: (bookingId) => api.get(`/ai/matches/${bookingId}`),
  getTrustScore: (userId) => api.get(`/ai/trust-score/${userId}`),
  detectFraud: (bookingData) => api.post('/ai/fraud-detection', bookingData),
  predictDemand: (service, location, date) => api.get('/ai/demand-prediction', { params: { service, location, date } }),
};

export default api;