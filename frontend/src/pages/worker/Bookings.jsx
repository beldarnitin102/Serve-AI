import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Chat from '../../components/Chat';
import { useAuth } from '../../context/AuthContext';
import { bookingAPI } from '../../services/api';
import { subscribeToBookingUpdates, subscribeToNewBookings } from '../../sockets/socket';
import { Calendar, Clock, MapPin, Star, User, Phone, MessageSquare, CheckCircle, XCircle, Navigation, Loader2 } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const WorkerBookings = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [activeChat, setActiveChat] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchBookings();
    
    const cleanupStatus = subscribeToBookingUpdates(() => {
      fetchBookings();
    });

    const cleanupNew = subscribeToNewBookings(() => {
      fetchBookings();
    });

    return () => {
      cleanupStatus();
      cleanupNew();
    };
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingAPI.getWorkerBookings();
      setBookings(response.data);
    } catch (error) {
      console.error('Failed to fetch worker bookings');
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
      alert('Failed to update status: ' + (error.response?.data?.message || error.message));
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

  const pendingRequests = bookings.filter(booking => booking.status === 'pending');

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'active') return booking.status === 'in_progress';
    return booking.status === activeTab;
  });

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-slate-400">
        <Loader2 size={40} className="animate-spin text-blue-500" />
        <p className="font-medium animate-pulse">Loading Live Bookings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Operations</h1>
          <p className="text-slate-300">Track and manage your live service commitments.</p>
        </div>
        <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
          <span className="text-xs font-bold text-blue-400 uppercase tracking-tighter">Live Connection Sync</span>
        </div>
      </div>

      {pendingRequests.length > 0 && (
        <Card className="p-6 bg-slate-900/80 border border-blue-500/20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-blue-400 font-black mb-2">New Requests</p>
              <h2 className="text-2xl font-bold text-white">{pendingRequests.length} request{pendingRequests.length === 1 ? '' : 's'} waiting from users</h2>
              <p className="text-slate-400 mt-2">Customers have sent service requests that appear in the Requests tab for your review.</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {pendingRequests.slice(0, 3).map((request) => (
                <div key={request._id} className="rounded-3xl bg-blue-500/5 p-4 border border-blue-500/10">
                  <p className="text-sm font-bold text-white capitalize">{request.service}</p>
                  <p className="text-slate-400 text-xs mt-2 truncate max-w-[180px]">{request.location}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      <div className="flex space-x-1 p-1 bg-white/5 rounded-xl w-fit border border-white/5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={16} className="mr-2" />
              {tab.name}
            </button>
          );
        })}
      </div>

      <div className="grid gap-6">
        {filteredBookings.length === 0 ? (
          <Card className="p-16 text-center border-dashed border-2 border-white/5 bg-transparent">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-500">
              <Calendar size={40} />
            </div>
            <h3 className="text-xl font-semibold mb-2">No {activeTab} bookings</h3>
            <p className="text-slate-400 max-w-xs mx-auto text-sm leading-relaxed">Your queue is currently clear in this category. New jobs will appear here in real-time.</p>
          </Card>
        ) : (
          filteredBookings.map((booking) => (
            <Card key={booking._id} className="p-6 hover:border-blue-500/30 transition-all group overflow-hidden relative">
              {updatingId === booking._id && (
                <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px] z-10 flex items-center justify-center">
                  <Loader2 size={32} className="animate-spin text-blue-500" />
                </div>
              )}
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-xl group-hover:scale-105 transition-transform">
                        <Clock size={28} />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-white capitalize">{booking.service}</h3>
                        <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-0.5">ID: {booking._id.slice(-8)}</p>
                      </div>
                    </div>
                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${
                      booking.status === 'in_progress' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                      booking.status === 'accepted' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                      booking.status === 'completed' ? 'bg-slate-500/10 text-slate-400 border-slate-500/20' :
                      'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      {booking.status.replace('_', ' ')}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-5 rounded-2xl bg-white/[0.03] border border-white/5">
                    <div className="flex items-start space-x-3">
                      <User size={18} className="text-blue-400 mt-1" />
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Customer</p>
                        <p className="text-sm font-bold text-white">{booking.user?.name}</p>
                        <div className="flex items-center text-yellow-400 text-xs mt-1">
                          <Star size={12} className="mr-1 fill-yellow-400" />
                          {booking.user?.trustScore || 4.5}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Calendar size={18} className="text-blue-400 mt-1" />
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Schedule</p>
                        <p className="text-sm font-bold text-white">{new Date(booking.scheduledDate).toLocaleDateString()}</p>
                        <p className="text-xs text-slate-400">{booking.scheduledTime}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <MapPin size={18} className="text-blue-400 mt-1" />
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Location</p>
                        <p className="text-sm font-bold text-white truncate w-40">{booking.location}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/[0.01] p-4 rounded-xl border border-white/5">
                    <p className="text-[10px] text-slate-500 uppercase font-black mb-2">Job Description</p>
                    <p className="text-sm text-slate-300 leading-relaxed italic">"{booking.description}"</p>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-2">
                    {booking.status === 'pending' && (
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => handleUpdateStatus(booking._id, 'accepted')}
                      >
                        <CheckCircle size={16} className="mr-2" />
                        Accept Job
                      </Button>
                    )}

                    {booking.status === 'accepted' && (
                      <div className="flex gap-2">
                        <Button 
                          variant="success" 
                          size="sm"
                          onClick={() => handleUpdateStatus(booking._id, 'in_progress')}
                        >
                          <Navigation size={16} className="mr-2" />
                          Start Journey
                        </Button>
                        <Button 
                          variant="secondary" 
                          size="sm"
                          className="bg-green-600/10 text-green-400 hover:bg-green-600/20 border-none"
                          onClick={() => handleUpdateStatus(booking._id, 'completed')}
                        >
                          <CheckCircle size={16} className="mr-2" />
                          Mark Done
                        </Button>
                      </div>
                    )}
                    
                    {booking.status === 'in_progress' && (
                      <Button 
                        variant="success" 
                        size="sm"
                        onClick={() => handleUpdateStatus(booking._id, 'completed')}
                      >
                        <CheckCircle size={16} className="mr-2" />
                        Complete Job
                      </Button>
                    )}

                    {(booking.status === 'accepted' || booking.status === 'in_progress') && (
                      <div className="w-full mt-4 rounded-2xl overflow-hidden border border-white/10 h-64 relative">
                        <MapContainer
                          center={[booking.coordinates?.lat || 28.6139, booking.coordinates?.lng || 77.2090]}
                          zoom={12}
                          style={{ height: '100%', width: '100%' }}
                        >
                          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                          
                          {/* Destination (Customer) */}
                          <Marker position={[booking.coordinates?.lat || 28.6139, booking.coordinates?.lng || 77.2090]}>
                            <Popup>
                              <div className="font-bold text-xs">Destination: {booking.user?.name}</div>
                            </Popup>
                          </Marker>

                          {/* Live Origin (Worker) */}
                          <Marker position={[28.62, 77.22]}> {/* Demo live location offset */}
                            <Popup>
                              <div className="font-bold text-blue-600 text-xs">You (Live)</div>
                            </Popup>
                          </Marker>
                        </MapContainer>
                        <div className="absolute top-2 right-2 z-[1000] px-3 py-1 bg-blue-600 text-white text-[10px] font-black rounded-full shadow-lg">
                          LIVE NAVIGATION
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3 w-full">
                      <Button 
                        variant="secondary" 
                        size="sm"
                        className="flex-1"
                        onClick={() => setActiveChat({
                          bookingId: booking._id,
                          receiverId: booking.user?._id,
                          receiverName: booking.user?.name
                        })}
                      >
                        <MessageSquare size={16} className="mr-2" />
                        Live Chat
                      </Button>
                      
                      {booking.status === 'in_progress' && (
                        <Button variant="secondary" size="sm" className="bg-red-500/10 text-red-400 hover:bg-red-500/20 border-none">
                          SOS
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="lg:w-48 flex flex-col justify-between items-end lg:border-l border-white/10 lg:pl-6">
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Contract Value</p>
                    <p className="text-3xl font-black text-white">₹{booking.price?.total || 450}</p>
                    {booking.paymentStatus === 'frozen' && (
                      <div className="mt-2 px-3 py-1 bg-red-500/20 text-red-400 text-[10px] font-bold rounded-full border border-red-500/30 uppercase tracking-widest">
                        Payment Frozen
                      </div>
                    )}
                    {booking.guarantee?.isClaimed && (
                      <div className="mt-2 px-3 py-1 bg-orange-500/20 text-orange-400 text-[10px] font-bold rounded-full border border-orange-500/30 uppercase tracking-widest">
                        Guarantee Claimed
                      </div>
                    )}
                    {booking.priority === 'emergency' && (
                      <div className="mt-2 px-2 py-0.5 bg-red-500/20 text-red-400 text-[10px] font-bold rounded uppercase tracking-tighter inline-block">
                        Emergency Premium
                      </div>
                    )}
                  </div>
                  
                  <div className="text-right mt-6">
                    <div className="text-[10px] text-slate-500 font-bold mb-2">Platform AI Match</div>
                    <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '92%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <Modal
        isOpen={!!activeChat}
        onClose={() => setActiveChat(null)}
        title={`Chat with ${activeChat?.receiverName}`}
      >
        {activeChat && (
          <Chat 
            bookingId={activeChat.bookingId}
            receiverId={activeChat.receiverId}
            receiverName={activeChat.receiverName}
          />
        )}
      </Modal>
    </div>
  );
};

export default WorkerBookings;