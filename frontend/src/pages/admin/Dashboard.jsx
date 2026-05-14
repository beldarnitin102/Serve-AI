import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { adminAPI } from '../../services/api';
import { subscribeToBookingUpdates, subscribeToNewBookings } from '../../sockets/socket';
import { Users, UserPlus2, CalendarCheck, BarChart3, ShieldCheck, Bell, Activity, CheckCircle } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalWorkers: 0,
    totalBookings: 0,
    activeBookings: 0,
    completed: 0,
    emergency: 0
  });
  const [liveEvents, setLiveEvents] = useState([]);

  useEffect(() => {
    fetchStats();
    
    const cleanupBooking = subscribeToBookingUpdates((data) => {
      addLiveEvent(`Booking status changed: ${data.status}`);
      fetchStats();
    });

    const cleanupNew = subscribeToNewBookings((data) => {
      addLiveEvent(`New booking request: ${data.service}`);
      fetchStats();
    });

    return () => {
      cleanupBooking();
      cleanupNew();
    };
  }, []);

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getAnalytics();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch admin stats');
    }
  };

  const addLiveEvent = (message) => {
    setLiveEvents(prev => [{
      id: Date.now(),
      message,
      time: new Date().toLocaleTimeString()
    }, ...prev].slice(0, 5));
  };

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-400' },
    { label: 'Verified Workers', value: stats.totalWorkers, icon: UserPlus2, color: 'text-green-400' },
    { label: 'Total Bookings', value: stats.totalBookings, icon: CalendarCheck, color: 'text-yellow-400' },
    { label: 'Emergency Jobs', value: stats.emergency, icon: Bell, color: 'text-red-400' }
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Platform Overview</h1>
          <p className="text-slate-300">Live monitoring and operational control center.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-xl">
          <Activity size={16} className="text-green-400 animate-pulse" />
          <span className="text-xs font-bold text-green-400 uppercase tracking-wider">Live System Active</span>
        </div>
      </div>

      <div className="grid xl:grid-cols-4 gap-6">
        {statCards.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.label} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-slate-400">{item.label}</p>
                  <h2 className="text-3xl font-bold mt-2">{item.value}</h2>
                </div>
                <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${item.color}`}>
                  <Icon size={24} />
                </div>
              </div>
              <p className="text-xs text-slate-500">Updated in real-time</p>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-6">Live Events Log</h2>
          <div className="space-y-4">
            {liveEvents.length === 0 ? (
              <div className="h-48 flex items-center justify-center border-2 border-dashed border-white/5 rounded-3xl">
                <p className="text-slate-500 text-sm italic">Waiting for platform activity...</p>
              </div>
            ) : (
              liveEvents.map(event => (
                <div key={event.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 animate-slide-in">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                    <p className="text-sm text-slate-200">{event.message}</p>
                  </div>
                  <span className="text-xs text-slate-500">{event.time}</span>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">AI Safety Insights</h2>
          <div className="space-y-4">
            <div className="p-4 bg-red-500/5 rounded-2xl border border-red-500/10">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck size={16} className="text-red-400" />
                <h4 className="text-sm font-bold text-red-400">Fraud Alert</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">System detected high-frequency location spoofing in Sector 4. Manual audit recommended.</p>
            </div>
            <div className="p-4 bg-green-500/5 rounded-2xl border border-green-500/10">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={16} className="text-green-400" />
                <h4 className="text-sm font-bold text-green-400">Trust Index</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">Worker trust index has increased by 14% overall following the new AI verification module rollout.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
