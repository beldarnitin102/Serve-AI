import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import {
  Calendar,
  Clock,
  MapPin,
  Star,
  TrendingUp,
  Users,
  CheckCircle,
  AlertCircle,
  Plus
} from 'lucide-react';

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock data - in real app, fetch from API
  const [stats, setStats] = useState({
    totalBookings: 12,
    completedBookings: 10,
    activeBookings: 1,
    totalSpent: 2450
  });

  const [recentBookings, setRecentBookings] = useState([
    {
      id: 1,
      service: 'Plumbing',
      worker: 'John Smith',
      date: '2024-01-15',
      time: '14:00',
      status: 'completed',
      amount: 150
    },
    {
      id: 2,
      service: 'Electrical',
      worker: 'Mike Johnson',
      date: '2024-01-20',
      time: '10:00',
      status: 'in_progress',
      amount: 200
    }
  ]);

  const quickActions = [
    {
      title: 'Book Service',
      description: 'Find and book a service',
      icon: Calendar,
      action: () => navigate('/user/book'),
      color: 'from-blue-500 to-cyan-400'
    },
    {
      title: 'Emergency',
      description: '60-minute guarantee',
      icon: AlertCircle,
      action: () => navigate('/user/emergency'),
      color: 'from-red-500 to-pink-400'
    },
    {
      title: 'My Bookings',
      description: 'View all bookings',
      icon: Clock,
      action: () => navigate('/user/bookings'),
      color: 'from-green-500 to-teal-400'
    },
    {
      title: 'Favorites',
      description: 'Saved workers',
      icon: Star,
      action: () => navigate('/user/favorites'),
      color: 'from-yellow-500 to-orange-400'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'in_progress': return 'text-blue-400';
      case 'pending': return 'text-yellow-400';
      case 'cancelled': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-slate-300">
            Here's what's happening with your services today.
          </p>
        </div>
        <Button onClick={() => navigate('/user/book')}>
          <Plus size={20} className="mr-2" />
          Book Service
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Bookings</p>
              <p className="text-2xl font-bold">{stats.totalBookings}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Calendar size={24} className="text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Completed</p>
              <p className="text-2xl font-bold text-green-400">{stats.completedBookings}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <CheckCircle size={24} className="text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Active</p>
              <p className="text-2xl font-bold text-blue-400">{stats.activeBookings}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Clock size={24} className="text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Spent</p>
              <p className="text-2xl font-bold">${stats.totalSpent}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <TrendingUp size={24} className="text-purple-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Card
                key={index}
                hover
                className="p-6 cursor-pointer"
                onClick={action.action}
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon size={24} className="text-white" />
                </div>
                <h3 className="font-semibold mb-2">{action.title}</h3>
                <p className="text-slate-400 text-sm">{action.description}</p>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent Bookings */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Recent Bookings</h2>
          <Button variant="secondary" onClick={() => navigate('/user/bookings')}>
            View All
          </Button>
        </div>

        <div className="space-y-4">
          {recentBookings.map((booking) => (
            <Card key={booking.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center">
                    <Users size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{booking.service}</h3>
                    <p className="text-slate-400">{booking.worker}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <div className="flex items-center text-slate-400 text-sm">
                        <Calendar size={14} className="mr-1" />
                        {booking.date}
                      </div>
                      <div className="flex items-center text-slate-400 text-sm">
                        <Clock size={14} className="mr-1" />
                        {booking.time}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${getStatusColor(booking.status)}`}>
                    {booking.status.replace('_', ' ').toUpperCase()}
                  </div>
                  <div className="text-lg font-bold mt-1">${booking.amount}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;