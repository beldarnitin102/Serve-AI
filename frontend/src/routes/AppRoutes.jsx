import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider, useAuth } from "../context/AuthContext";
import ProtectedRoute from "../protectedRoutes/ProtectedRoute";

// Layouts
import UserLayout from "../layouts/UserLayout";
import WorkerLayout from "../layouts/WorkerLayout";
import AdminLayout from "../layouts/AdminLayout";

// Public Pages
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import VerifyOTP from "../pages/VerifyOTP";
import AIChat from "../pages/AIChat";

// User Pages
import UserDashboard from "../pages/user/Dashboard";
import UserBookings from "../pages/user/Bookings";
import UserProfile from "../pages/user/Profile";
import UserSettings from "../pages/user/Settings";
import BookService from "../pages/user/BookService";
import UserMessages from "../pages/user/Messages";
import UserNotifications from "../pages/user/Notifications";
import UserEmergency from "../pages/user/Emergency";
import UserFavorites from "../pages/user/Favorites";

// Worker Pages
import WorkerDashboard from "../pages/worker/Dashboard";
import WorkerBookings from "../pages/worker/Bookings";
import WorkerProfile from "../pages/worker/Profile";
import WorkerSettings from "../pages/worker/Settings";
import AvailableJobs from "../pages/worker/AvailableJobs";
import WorkerLocation from "../pages/worker/Location";
import WorkerNotifications from "../pages/worker/Notifications";
import WorkerAssistant from "../pages/worker/Assistant";
import WorkerVerification from "../pages/worker/Verification";

// Admin Pages
import AdminDashboard from "../pages/admin/Dashboard";
import AdminUsers from "../pages/admin/Users";
import AdminWorkers from "../pages/admin/Workers";
import AdminBookings from "../pages/admin/Bookings";
import AdminAnalytics from "../pages/admin/Analytics";
import AdminEmergency from "../pages/admin/Emergency";
import AdminMessages from "../pages/admin/Messages";
import AdminSettings from "../pages/admin/Settings";

const DashboardRedirect = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  switch (user?.role) {
    case "user":
      return <Navigate to="/user/dashboard" replace />;

    case "worker":
      return user?.worker?.verification?.isVerified 
        ? <Navigate to="/worker/dashboard" replace /> 
        : <Navigate to="/worker/verification" replace />;

    case "admin":
      return <Navigate to="/admin/dashboard" replace />;

    default:
      return <Navigate to="/" replace />;
  }
};

const AppRoutes = () => {
  return (
    <AuthProvider>
      <Routes>
          {/* PUBLIC */}
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<AIChat />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />

          {/* USER */}
          <Route
            path="/user"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <UserLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="book" element={<BookService />} />
            <Route path="bookings" element={<UserBookings />} />
            <Route path="messages" element={<UserMessages />} />
            <Route path="notifications" element={<UserNotifications />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="settings" element={<UserSettings />} />
            <Route path="emergency" element={<UserEmergency />} />
            <Route path="favorites" element={<UserFavorites />} />
          </Route>

          {/* WORKER */}
          <Route
            path="/worker"
            element={
              <ProtectedRoute allowedRoles={["worker"]}>
                <WorkerLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<WorkerDashboard />} />
            <Route path="jobs" element={<AvailableJobs />} />
            <Route path="bookings" element={<WorkerBookings />} />
            <Route path="location" element={<WorkerLocation />} />
            <Route
              path="notifications"
              element={<WorkerNotifications />}
            />
            <Route path="profile" element={<WorkerProfile />} />
            <Route path="verification" element={<WorkerVerification />} />
            <Route path="assistant" element={<WorkerAssistant />} />
            <Route path="settings" element={<WorkerSettings />} />
          </Route>

          {/* ADMIN */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="workers" element={<AdminWorkers />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="emergency" element={<AdminEmergency />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* REDIRECT */}
          <Route path="/dashboard" element={<DashboardRedirect />} />

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
  );
};

export default AppRoutes;