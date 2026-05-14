import { useState } from "react";

import {
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import {
  Home,
  Calendar,
  User,
  Bell,
  Settings,
  LogOut,
  Menu,
  MessageSquare,
  MapPin,
  Clock,
  ShieldCheck,
} from "lucide-react";

const WorkerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const location = useLocation();

  const navigation = [
    {
      name: "Dashboard",
      href: "/worker/dashboard",
      icon: Home,
      alwaysShow: true,
    },

    {
      name: "Available Jobs",
      href: "/worker/jobs",
      icon: Calendar,
      alwaysShow: true,
    },

    {
      name: "My Bookings",
      href: "/worker/bookings",
      icon: Clock,
      requiresVerification: true,
    },

    {
      name: "Location",
      href: "/worker/location",
      icon: MapPin,
      requiresVerification: true,
    },

    {
      name: "Notifications",
      href: "/worker/notifications",
      icon: Bell,
      requiresVerification: true,
    },

    {
      name: "Profile",
      href: "/worker/profile",
      icon: User,
      alwaysShow: true,
    },
    {
      name: "Verification",
      href: "/worker/verification",
      icon: ShieldCheck,
      showWhenUnverified: true,
    },

    {
      name: "Settings",
      href: "/worker/settings",
      icon: Settings,
      alwaysShow: true,
    },
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
                  onClick={() => {
                    navigate(item.href);
                    setSidebarOpen(false);
                  }}
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
                <p className="text-sm font-medium truncate">
                  {user?.name}
                </p>

                <p className="text-xs text-slate-400 truncate">
                  {user?.email}
                </p>
              </div>
            </div>

            {/* Temporarily disabled Logout
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 rounded-xl text-slate-300 hover:bg-red-500/20 hover:text-red-400 transition-all duration-200"
            >
              <LogOut size={20} className="mr-3" />

              Logout
            </button>
            */}
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="lg:pl-64">
        {/* Header */}
        <div className="lg:hidden flex items-center justify-between h-16 px-4 bg-slate-900/95 border-b border-white/10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl bg-white/10"
          >
            <Menu size={20} />
          </button>

          <h1 className="text-xl font-semibold">
            ServAI Worker
          </h1>

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