import React, { useState } from 'react';
import {
  Outlet,
  useNavigate,
  useLocation
} from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Home,
  Users,
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  Shield,
  AlertTriangle,
  MessageSquare
} from 'lucide-react';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: Home },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Workers', href: '/admin/workers', icon: Shield },
    { name: 'Bookings', href: '/admin/bookings', icon: Calendar },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Emergency', href: '/admin/emergency', icon: AlertTriangle },
    { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#071226] text-white">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900/95 backdrop-blur-xl border-r border-white/10 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 border-b border-white/10">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              ServAI Admin
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
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
                      ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon size={20} className="mr-3" />
                  {item.name}
                </button>
              );
            })}
          </nav>

          {/* User info and logout */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-400 flex items-center justify-center mr-3">
                <Shield size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-slate-400 truncate">Administrator</p>
              </div>
            </div>
            {/* Temporarily disabled Logout
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-slate-300 hover:bg-red-500/20 hover:text-red-400 rounded-xl transition-all duration-200"
            >
              <LogOut size={20} className="mr-3" />
              Logout
            </button>
            */}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between h-16 px-4 bg-slate-900/95 backdrop-blur-xl border-b border-white/10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl bg-white/10"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-xl font-semibold">ServAI Admin</h1>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Page content */}
        <main className="p-6">
          {<Outlet />}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;