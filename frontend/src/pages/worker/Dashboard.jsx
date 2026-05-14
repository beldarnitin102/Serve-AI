import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { Calendar, DollarSign, Star, Users, MapPin, Clock, TrendingUp, User } from 'lucide-react';
import { subscribeToNewBookings } from '../../sockets/socket';
import { bookingAPI } from '../../services/api';

const WorkerDashboard = () => {
  const [stats, setStats] = useState({
    todayEarnings: 0,
    totalEarnings: 0,
    completedJobs: 0,
    activeJobs: 0,
    rating: 0,
    responseTime: 0
  });
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    
    // Subscribe to real-time updates
    const cleanup = subscribeToNewBookings(() => {
      fetchDashboardData();
    });
    
    return () => cleanup();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await bookingAPI.getWorkerBookings();
      const allBookings = response.data;
      setBookings(allBookings);

      // Real-time stat calculation
      const completed = allBookings.filter(b => b.status === 'completed');
      const active = allBookings.filter(b => b.status === 'in_progress');
      const today = completed.filter(b => 
        new Date(b.updatedAt).toDateString() === new Date().toDateString()
      );

      const totalEarnings = completed.reduce((sum, b) => sum + (b.price?.total || 0), 0);
      const todayEarnings = today.reduce((sum, b) => sum + (b.price?.total || 0), 0);

      setStats({
        todayEarnings,
        totalEarnings,
        completedJobs: completed.length,
        activeJobs: active.length,
        rating: user?.worker?.rating || 4.8,
        responseTime: 15
      });
    } catch (error) {
      console.error('Dashboard sync failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const recentJobs = bookings.filter(b => ['in_progress', 'accepted', 'scheduled'].includes(b.status));
  const availableJobs = bookings.filter(b => b.status === 'pending');

  const handleDeclineJob = (jobId) => {
    setAvailableJobs(availableJobs.filter(job => job.id !== jobId));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'in_progress': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'scheduled': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'completed': return 'text-green-400 bg-green-500/10 border-green-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const formatStatus = (status) => {
    return status.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="space-y-8">
      {/* New Request Alert */}
      {availableJobs.length > 0 && (
        <div className="p-6 bg-blue-600 rounded-3xl shadow-[0_0_50px_rgba(37,99,235,0.3)] flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Calendar size={24} className="text-white animate-bounce" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white">New Service Request!</h3>
              <p className="text-blue-100 text-sm">You have {availableJobs.length} new booking request(s) waiting for review.</p>
            </div>
          </div>
          <Button 
            onClick={() => navigate('/worker/bookings')} 
            className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-2xl font-black shadow-lg"
          >
            Review in My Bookings
          </Button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <DollarSign size={24} className="text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">${stats.todayEarnings}</div>
              <div className="text-slate-400 text-sm">Today's Earnings</div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <TrendingUp size={24} className="text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">${stats.totalEarnings.toLocaleString()}</div>
              <div className="text-slate-400 text-sm">Total Earnings</div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Users size={24} className="text-purple-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.completedJobs}</div>
              <div className="text-slate-400 text-sm">Jobs Completed</div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
              <Star size={24} className="text-yellow-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.rating}</div>
              <div className="text-slate-400 text-sm">Average Rating</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-8">
        {/* Current Jobs */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-6">Current Jobs</h3>

          {recentJobs.length === 0 ? (
            <div className="text-center py-8">
              <Calendar size={48} className="mx-auto text-slate-400 mb-4" />
              <p className="text-slate-400">No active jobs at the moment</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentJobs.map((job) => (
                <div key={job._id} className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold capitalize">{job.service}</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(job.status)}`}>
                      {formatStatus(job.status)}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-slate-300 text-sm">
                      <User size={14} className="mr-2" />
                      {job.user?.name}
                    </div>
                    <div className="flex items-center text-slate-400 text-sm">
                      <MapPin size={14} className="mr-2" />
                      {job.location}
                    </div>
                    <div className="flex items-center text-slate-400 text-sm">
                      <Clock size={14} className="mr-2" />
                      {new Date(job.scheduledDate).toLocaleDateString()} at {job.scheduledTime}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xl font-bold">₹{job.price?.total}</div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="secondary" onClick={() => navigate('/worker/bookings')}>
                        View Details
                      </Button>
                      {job.status === 'in_progress' && (
                        <Button size="sm" onClick={() => navigate('/worker/bookings')}>
                          Complete Job
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-6">Quick Actions</h3>

        <div className="grid md:grid-cols-3 gap-4">
          <Button variant="secondary" className="p-4 h-auto">
            <div className="text-center">
              <MapPin size={24} className="mx-auto mb-2" />
              <div>Update Location</div>
            </div>
          </Button>

          <Button variant="secondary" className="p-4 h-auto">
            <div className="text-center">
              <Clock size={24} className="mx-auto mb-2" />
              <div>Set Availability</div>
            </div>
          </Button>

          <Button variant="secondary" className="p-4 h-auto">
            <div className="text-center">
              <TrendingUp size={24} className="mx-auto mb-2" />
              <div>View Analytics</div>
            </div>
          </Button>
        </div>
      </Card>

      {/* Verification Modal Removed */}
    </div>
  );
};

export default WorkerDashboard;