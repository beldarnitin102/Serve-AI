import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { bookingAPI } from '../../services/api';
import {
  Calendar,
  Clock,
  MapPin,
  Star,
  TrendingUp,
  Users,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  Plus
} from 'lucide-react';

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalBookings: 0,
    completedBookings: 0,
    activeBookings: 0,
    totalSpent: 0
  });
  const [guaranteeSummary, setGuaranteeSummary] = useState({
    eligibleClaims: 0,
    frozenPayments: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await bookingAPI.getUserBookings();
        const bookings = response.data || [];

        const totalBookings = bookings.length;
        const completedBookings = bookings.filter(b => b.status === 'completed').length;
        const activeBookings = bookings.filter(b => ['accepted', 'in_progress', 'scheduled'].includes(b.status)).length;
        const totalSpent = bookings.reduce((sum, b) => sum + (b.price?.total || 0), 0);

        const eligibleClaims = bookings.filter((b) => {
          if (b.status !== 'completed' || b.guarantee?.isClaimed) return false;
          const completedAt = b.tracking?.completedAt;
          if (!completedAt) return false;
          return (Date.now() - new Date(completedAt).getTime()) < 24 * 60 * 60 * 1000;
        }).length;

        const frozenPayments = bookings.filter(b => b.paymentStatus === 'frozen').length;

        setStats({ totalBookings, completedBookings, activeBookings, totalSpent });
        setGuaranteeSummary({ eligibleClaims, frozenPayments });

        setRecentBookings(bookings.slice(-3).reverse().map((booking) => ({
          id: booking._id,
          service: booking.service,
          worker: booking.worker?.user?.name || 'Professional',
          date: new Date(booking.scheduledDate).toLocaleDateString(),
          time: booking.scheduledTime,
          status: booking.status,
          amount: booking.price?.total || 0
        })));
      } catch (error) {
        console.error('Failed to load dashboard data', error);
      }
    };

    loadDashboard();
  }, []);

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

      <Card className="p-6 bg-amber-500/10 border border-amber-500/20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-amber-200">Service Guarantee</h2>
            <p className="text-slate-300 text-sm mt-1">Track your 24-hour claim window and frozen payment status here.</p>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
            <div className="p-4 bg-white/5 rounded-3xl border border-white/10">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Claims Available</p>
              <p className="text-3xl font-black text-amber-300">{guaranteeSummary.eligibleClaims}</p>
            </div>
            <div className="p-4 bg-white/5 rounded-3xl border border-white/10">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Payments Frozen</p>
              <p className="text-3xl font-black text-amber-300">{guaranteeSummary.frozenPayments}</p>
            </div>
          </div>
        </div>
      </Card>

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
                        {booking.time?.start || booking.time}
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