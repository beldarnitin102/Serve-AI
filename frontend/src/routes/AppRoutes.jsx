import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/AuthContext';
import ProtectedRoute from '../protectedRoutes/ProtectedRoute';

// Layouts
import UserLayout from '../layouts/UserLayout';
import WorkerLayout from '../layouts/WorkerLayout';
import AdminLayout from '../layouts/AdminLayout';

// Pages
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import VerifyOTP from '../pages/VerifyOTP';

// User pages
import UserDashboard from '../pages/user/Dashboard';
import UserBookings from '../pages/user/Bookings';
import UserProfile from '../pages/user/Profile';
import UserSettings from '../pages/user/Settings';
import BookService from '../pages/user/BookService';

// Worker pages
import WorkerDashboard from '../pages/worker/Dashboard';
import WorkerBookings from '../pages/worker/Bookings';
import WorkerProfile from '../pages/worker/Profile';
import WorkerSettings from '../pages/worker/Settings';
import AvailableJobs from '../pages/worker/AvailableJobs';

// Admin pages
import AdminDashboard from '../pages/admin/Dashboard';
import AdminUsers from '../pages/admin/Users';
import AdminWorkers from '../pages/admin/Workers';
import AdminBookings from '../pages/admin/Bookings';
import AdminAnalytics from '../pages/admin/Analytics';

const AppRoutes = () => {
  return (
    <Router>
      <AuthProvider>
        <RoutesComponent />
      </AuthProvider>
    </Router>
  );
};

const RoutesComponent = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />

      {/* User routes */}
      <Route
        path="/user/*"
        element={
          <ProtectedRoute allowedRoles={['user']}>
            <UserLayout>
              <Routes>
                <Route path="dashboard" element={<UserDashboard />} />
                <Route path="book" element={<BookService />} />
                <Route path="bookings" element={<UserBookings />} />
                <Route path="profile" element={<UserProfile />} />
                <Route path="settings" element={<UserSettings />} />
                <Route path="*" element={<Navigate to="/user/dashboard" replace />} />
              </Routes>
            </UserLayout>
          </ProtectedRoute>
        }
      />

      {/* Worker routes */}
      <Route
        path="/worker/*"
        element={
          <ProtectedRoute allowedRoles={['worker']}>
            <WorkerLayout>
              <Routes>
                <Route path="dashboard" element={<WorkerDashboard />} />
                <Route path="jobs" element={<AvailableJobs />} />
                <Route path="bookings" element={<WorkerBookings />} />
                <Route path="profile" element={<WorkerProfile />} />
                <Route path="settings" element={<WorkerSettings />} />
                <Route path="*" element={<Navigate to="/worker/dashboard" replace />} />
              </Routes>
            </WorkerLayout>
          </ProtectedRoute>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout>
              <Routes>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="workers" element={<AdminWorkers />} />
                <Route path="bookings" element={<AdminBookings />} />
                <Route path="analytics" element={<AdminAnalytics />} />
                <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
              </Routes>
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* Redirect based on role */}
      <Route
        path="/dashboard"
        element={
          isAuthenticated ? (
            <Navigate
              to={
                user?.role === 'user' ? '/user/dashboard' :
                user?.role === 'worker' ? '/worker/dashboard' :
                user?.role === 'admin' ? '/admin/dashboard' : '/'
              }
              replace
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;