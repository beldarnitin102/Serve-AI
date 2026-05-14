import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Calendar, DollarSign, Star, Users, MapPin, Clock, TrendingUp } from 'lucide-react';

const WorkerDashboard = () => {
  const [stats, setStats] = useState({
    todayEarnings: 0,
    totalEarnings: 0,
    completedJobs: 0,
    activeJobs: 0,
    rating: 0,
    responseTime: 0
  });

  const [recentJobs, setRecentJobs] = useState([
    {
      id: 1,
      service: 'Plumbing',
      customer: 'John Doe',
      location: '123 Main St',
      time: '2:00 PM',
      status: 'in_progress',
      amount: 150
    },
    {
      id: 2,
      service: 'Electrical',
      customer: 'Jane Smith',
      location: '456 Oak Ave',
      time: '4:30 PM',
      status: 'scheduled',
      amount: 200
    }
  ]);

  const [availableJobs, setAvailableJobs] = useState([
    {
      id: 3,
      service: 'Cleaning',
      customer: 'Bob Johnson',
      location: '789 Pine Rd',
      time: 'Tomorrow 9:00 AM',
      amount: 120,
      distance: 2.3,
      urgency: 'normal'
    },
    {
      id: 4,
      service: 'Carpentry',
      customer: 'Alice Brown',
      location: '321 Elm St',
      time: 'Tomorrow 2:00 PM',
      amount: 180,
      distance: 4.1,
      urgency: 'high'
    }
  ]);

  // Mock data loading
  useEffect(() => {
    setStats({
      todayEarnings: 320,
      totalEarnings: 15420,
      completedJobs: 87,
      activeJobs: 2,
      rating: 4.8,
      responseTime: 15
    });
  }, []);

  const handleAcceptJob = (jobId) => {
    // In real app, call API to accept job
    alert('Job accepted! Customer will be notified.');
    setAvailableJobs(availableJobs.filter(job => job.id !== jobId));
  };

  const handleDeclineJob = (jobId) => {
    // In real app, call API to decline job
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
      <div>
        <h1 className="text-3xl font-bold mb-2">Worker Dashboard</h1>
        <p className="text-slate-300">
          Manage your jobs, track earnings, and grow your business.
        </p>
      </div>

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

      <div className="grid lg:grid-cols-2 gap-8">
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
                <div key={job.id} className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">{job.service}</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(job.status)}`}>
                      {formatStatus(job.status)}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-slate-300 text-sm">
                      <Users size={14} className="mr-2" />
                      {job.customer}
                    </div>
                    <div className="flex items-center text-slate-400 text-sm">
                      <MapPin size={14} className="mr-2" />
                      {job.location}
                    </div>
                    <div className="flex items-center text-slate-400 text-sm">
                      <Clock size={14} className="mr-2" />
                      {job.time}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xl font-bold">${job.amount}</div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="secondary">
                        View Details
                      </Button>
                      {job.status === 'in_progress' && (
                        <Button size="sm">
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

        {/* Available Jobs */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-6">Available Jobs</h3>

          {availableJobs.length === 0 ? (
            <div className="text-center py-8">
              <Users size={48} className="mx-auto text-slate-400 mb-4" />
              <p className="text-slate-400">No new jobs available right now</p>
              <p className="text-slate-500 text-sm mt-2">Check back later or enable notifications</p>
            </div>
          ) : (
            <div className="space-y-4">
              {availableJobs.map((job) => (
                <div key={job.id} className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">{job.service}</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      job.urgency === 'high'
                        ? 'text-red-400 bg-red-500/10 border-red-500/20'
                        : 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
                    }`}>
                      {job.urgency === 'high' ? 'Urgent' : 'Normal'}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-slate-300 text-sm">
                      <Users size={14} className="mr-2" />
                      {job.customer}
                    </div>
                    <div className="flex items-center text-slate-400 text-sm">
                      <MapPin size={14} className="mr-2" />
                      {job.location} ({job.distance} km away)
                    </div>
                    <div className="flex items-center text-slate-400 text-sm">
                      <Clock size={14} className="mr-2" />
                      {job.time}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xl font-bold">${job.amount}</div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleDeclineJob(job.id)}
                      >
                        Decline
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleAcceptJob(job.id)}
                      >
                        Accept
                      </Button>
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
    </div>
  );
};

export default WorkerDashboard;