import { useState, useEffect, useCallback } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { subscribeToNewBookings } from "../sockets/socket";
import {
  Home, Calendar, User, Bell, Settings, LogOut,
  Menu, MessageSquare, MapPin, Clock, ShieldCheck, X, BellRing
} from "lucide-react";

const WorkerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newJobToast, setNewJobToast] = useState(null); // { service, customerName }
  const [toastVisible, setToastVisible] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // ── Global real-time new booking toast ──────────────────────────
  useEffect(() => {
    const cleanup = subscribeToNewBookings((data) => {
      setNewJobToast(data);
      setToastVisible(true);
      // Auto-dismiss after 8 seconds
      setTimeout(() => setToastVisible(false), 8000);
    });
    return () => cleanup();
  }, []);

  const dismissToast = useCallback(() => setToastVisible(false), []);

  const goToBookings = useCallback(() => {
    setToastVisible(false);
    navigate('/worker/bookings');
  }, [navigate]);
  // ────────────────────────────────────────────────────────────────

  const navigation = [
    { name: "Dashboard", href: "/worker/dashboard", icon: Home, alwaysShow: true },
    { name: "Available Jobs", href: "/worker/jobs", icon: Calendar, alwaysShow: true },
    { name: "My Bookings", href: "/worker/bookings", icon: Clock, requiresVerification: true },
    { name: "Location", href: "/worker/location", icon: MapPin, requiresVerification: true },
    { name: "Notifications", href: "/worker/notifications", icon: Bell, requiresVerification: true },
    { name: "Profile", href: "/worker/profile", icon: User, alwaysShow: true },
    { name: "Verification", href: "/worker/verification", icon: ShieldCheck, showWhenUnverified: true },
    { name: "Settings", href: "/worker/settings", icon: Settings, alwaysShow: true },
  ];

  const isVerified = user?.worker?.verification?.isVerified;

  const filteredNavigation = navigation.filter((item) => {
    if (item.alwaysShow) return true;
    if (item.requiresVerification && !isVerified) return false;
    if (item.showWhenUnverified && isVerified) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#071226] text-white">

      {/* ── GLOBAL NEW JOB TOAST NOTIFICATION ── */}
      {toastVisible && newJobToast && (
        <div
          className="fixed top-4 right-4 z-[9999] max-w-sm w-full"
          style={{ animation: 'slideInRight 0.3s ease-out' }}
        >
          <style>{`
            @keyframes slideInRight {
              from { transform: translateX(120%); opacity: 0; }
              to { transform: translateX(0); opacity: 1; }
            }
            @keyframes pulse-ring {
              0% { transform: scale(1); opacity: 1; }
              100% { transform: scale(1.5); opacity: 0; }
            }
          `}</style>
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-2xl shadow-blue-500/40 border border-blue-400/30 p-4">
            <div className="flex items-start gap-3">
              {/* Animated bell icon */}
              <div className="relative flex-shrink-0 mt-0.5">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <BellRing size={20} className="text-white" style={{ animation: 'wiggle 0.5s ease-in-out 3' }} />
                </div>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full">
                  <span className="absolute inset-0 bg-yellow-400 rounded-full" style={{ animation: 'pulse-ring 1s ease-out infinite' }} />
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-black text-sm">🔔 New Booking Request!</p>
                <p className="text-blue-100 text-xs mt-0.5">
                  <span className="font-bold">{newJobToast.customerName || 'A customer'}</span> booked{' '}
                  <span className="font-bold capitalize">{newJobToast.service || 'a service'}</span>
                </p>
                <button
                  onClick={goToBookings}
                  className="mt-2 text-xs font-black text-yellow-300 hover:text-yellow-100 underline underline-offset-2 transition-colors"
                >
                  View in My Bookings →
                </button>
              </div>

              {/* Close */}
              <button
                onClick={dismissToast}
                className="flex-shrink-0 w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X size={12} className="text-white" />
              </button>
            </div>

            {/* Progress bar */}
            <div className="mt-3 h-0.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-400 rounded-full"
                style={{ animation: 'shrink 8s linear forwards' }}
              />
            </div>
            <style>{`
              @keyframes shrink { from { width: 100%; } to { width: 0%; } }
            `}</style>
          </div>
        </div>
      )}
      {/* ─────────────────────────────────────── */}

      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900/95 backdrop-blur-xl border-r border-white/10 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 border-b border-white/10">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              ServAI Worker
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {filteredNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <button
                  key={item.name}
                  onClick={() => { navigate(item.href); setSidebarOpen(false); }}
                  className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon size={20} className="mr-3" />
                  {item.name}
                </button>
              );
            })}
          </nav>

          {/* User */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-blue-400 flex items-center justify-center mr-3">
                <User size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 rounded-xl text-slate-300 hover:bg-red-500/20 hover:text-red-400 transition-all duration-200"
            >
              <LogOut size={20} className="mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="lg:pl-64">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between h-16 px-4 bg-slate-900/95 border-b border-white/10">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-xl bg-white/10">
            <Menu size={20} />
          </button>
          <h1 className="text-xl font-semibold">ServAI Worker</h1>
          <div className="w-10" />
        </div>

        {/* Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default WorkerLayout;