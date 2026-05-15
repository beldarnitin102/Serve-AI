import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { bookingAPI } from '../../services/api';
import { subscribeToBookingUpdates, subscribeToNewBookings } from '../../sockets/socket';
import {
  Calendar, Clock, MapPin, Star, User, MessageSquare,
  CheckCircle, Navigation, Loader2, AlertCircle, Lock, ShieldAlert
} from 'lucide-react';
import Chat from '../../components/Chat';

// Helper: safely get string from location field
const getLocationString = (location) => {
  if (!location) return 'N/A';
  if (typeof location === 'string') return location;
  if (typeof location === 'object') return location.address || 'N/A';
  return 'N/A';
};

// Helper: safely get string from scheduledTime field
const getTimeString = (scheduledTime) => {
  if (!scheduledTime) return 'N/A';
  if (typeof scheduledTime === 'string') return scheduledTime;
  if (typeof scheduledTime === 'object') return scheduledTime.start || 'N/A';
  return 'N/A';
};

const WorkerBookings = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [activeChat, setActiveChat] = useState(null);

  useEffect(() => {
    fetchBookings();
    const cleanupStatus = subscribeToBookingUpdates(() => fetchBookings());
    const cleanupNew = subscribeToNewBookings(async (data) => {
      // Directly fetch and inject the new booking so it always appears
      // regardless of which worker it was assigned to in the DB
      if (data?.bookingId) {
        try {
          const response = await bookingAPI.getBookingById(data.bookingId);
          const newBooking = response.data;
          setBookings(prev => {
            const filtered = prev.filter(b => b._id !== newBooking._id);
            const nonPending = filtered.filter(b => b.status !== 'pending');
            const pending = filtered.filter(b => b.status === 'pending').slice(0, 2);
            return [newBooking, ...pending, ...nonPending];
          });
        } catch {
          fetchBookings();
        }
      } else {
        fetchBookings();
      }
    });
    return () => { cleanupStatus(); cleanupNew(); };
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingAPI.getWorkerBookings();
      setBookings(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to fetch worker bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      await bookingAPI.updateBookingStatus(id, status);
      await fetchBookings();
    } catch (error) {
      alert('Failed to update: ' + (error.response?.data?.message || error.message));
    } finally {
      setUpdatingId(null);
    }
  };

  const tabs = [
    { id: 'pending', name: 'Requests', icon: Clock },
    { id: 'accepted', name: 'Accepted', icon: Calendar },
    { id: 'active', name: 'Active', icon: Navigation },
    { id: 'completed', name: 'Completed', icon: CheckCircle },
  ];

  const pendingRequests = bookings.filter(b => b.status === 'pending');

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'active') return booking.status === 'in_progress';
    return booking.status === activeTab;
  });

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-slate-400">
        <Loader2 size={40} className="animate-spin text-blue-500" />
        <p className="font-medium animate-pulse">Loading Bookings...</p>
      </div>
    );
  }

  if (activeChat) {
    return (
      <div className="space-y-4">
        <Button variant="secondary" size="sm" onClick={() => setActiveChat(null)}>← Back</Button>
        <Chat
          bookingId={activeChat.bookingId}
          receiverId={activeChat.receiverId}
          receiverName={activeChat.receiverName}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Operations</h1>
          <p className="text-slate-300">Manage your service requests and active jobs.</p>
        </div>
        <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
          <span className="text-xs font-bold text-blue-400">LIVE SYNC ON</span>
        </div>
      </div>

      {/* Incoming Requests Banner (if any pending) */}
      {pendingRequests.length > 0 && (
        <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl">
          <p className="text-yellow-400 font-black uppercase text-xs tracking-widest mb-3">
            🔔 {pendingRequests.length} New Request{pendingRequests.length > 1 ? 's' : ''} Waiting
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {pendingRequests.slice(0, 3).map((request) => (
              <div key={request._id} className="rounded-2xl bg-white/5 p-4 border border-white/10">
                <p className="text-sm font-bold text-white capitalize">{request.service}</p>
                <p className="text-slate-400 text-xs mt-1 truncate">{getLocationString(request.location)}</p>
                <button
                  className="mt-3 w-full text-xs font-bold text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-lg py-1.5 transition"
                  onClick={() => setActiveTab('pending')}
                >
                  View Request →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const count = tab.id === 'active'
            ? bookings.filter(b => b.status === 'in_progress').length
            : bookings.filter(b => b.status === tab.id).length;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-2 px-5 rounded-lg text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5'
              }`}
            >
              <Icon size={14} />
              {tab.name}
              <span className="opacity-60">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Bookings List */}
      <div className="space-y-6">
        {filteredBookings.length === 0 ? (
          <Card className="p-16 text-center border-dashed border-2 border-white/5 bg-transparent">
            <Calendar size={40} className="mx-auto text-slate-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-white">No {activeTab} bookings</h3>
            <p className="text-slate-400 text-sm">New jobs will appear here in real-time as customers book.</p>
          </Card>
        ) : (
          filteredBookings.map((booking) => (
            <Card key={booking._id} className="p-6 hover:border-blue-500/30 transition-all group relative overflow-hidden">
              {updatingId === booking._id && (
                <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm z-10 flex items-center justify-center">
                  <Loader2 size={32} className="animate-spin text-blue-500" />
                </div>
              )}

              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 space-y-4">
                  {/* Title + Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-xl flex-shrink-0">
                        <Clock size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-white capitalize">{booking.service}</h3>
                        <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">ID: {booking._id.slice(-8)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        booking.status === 'in_progress' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                        booking.status === 'accepted' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        booking.status === 'completed' ? 'bg-slate-500/10 text-slate-400 border-slate-500/20' :
                        booking.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                        'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                        {booking.status.replace('_', ' ')}
                      </span>

                      {booking.paymentStatus === 'frozen' && (
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border bg-red-500/10 text-red-500 border-red-500/20 flex items-center gap-1">
                          <Lock size={10} /> Payment Frozen
                        </span>
                      )}

                      {booking.guarantee?.isClaimed && (
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border bg-orange-500/10 text-orange-400 border-orange-500/20 flex items-center gap-1">
                          <ShieldAlert size={10} /> Guarantee Claimed
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Info Grid */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/5">
                    <div className="flex items-start gap-3">
                      <User size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Customer</p>
                        <p className="text-sm font-bold text-white">{booking.user?.name || 'Unknown'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Schedule</p>
                        <p className="text-sm font-bold text-white">{new Date(booking.scheduledDate).toLocaleDateString()}</p>
                        <p className="text-xs text-slate-400">{getTimeString(booking.scheduledTime)}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Location</p>
                        <p className="text-sm font-bold text-white truncate max-w-[180px]">{getLocationString(booking.location)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {booking.description && (
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                      <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Description</p>
                      <p className="text-sm text-slate-300 italic">"{booking.description}"</p>
                    </div>
                  )}

                  {/* Guarantee Reason (if claimed) */}
                  {booking.guarantee?.isClaimed && booking.guarantee?.reason && (
                    <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                      <p className="text-[10px] text-red-400 uppercase font-black mb-1 flex items-center gap-1">
                        <ShieldAlert size={10} /> Customer Guarantee Claim Reason
                      </p>
                      <p className="text-sm text-slate-300 italic">"{booking.guarantee.reason}"</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 pt-2">
                    {booking.status === 'pending' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleUpdateStatus(booking._id, 'accepted')}
                      >
                        <CheckCircle size={14} className="mr-2" /> Accept Job
                      </Button>
                    )}

                    {booking.status === 'accepted' && (
                      <>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-500 text-white"
                          onClick={() => handleUpdateStatus(booking._id, 'in_progress')}
                        >
                          <Navigation size={14} className="mr-2" /> Start Journey
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleUpdateStatus(booking._id, 'completed')}
                        >
                          <CheckCircle size={14} className="mr-2" /> Mark Done
                        </Button>
                      </>
                    )}

                    {booking.status === 'in_progress' && (
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-500 text-white"
                        onClick={() => handleUpdateStatus(booking._id, 'completed')}
                      >
                        <CheckCircle size={14} className="mr-2" /> Complete Job
                      </Button>
                    )}

                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setActiveChat({
                        bookingId: booking._id,
                        receiverId: booking.user?._id,
                        receiverName: booking.user?.name || 'Customer'
                      })}
                    >
                      <MessageSquare size={14} className="mr-2" /> Chat
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default WorkerBookings;