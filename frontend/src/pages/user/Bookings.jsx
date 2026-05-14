import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { bookingAPI } from '../../services/api';
import { subscribeToBookingUpdates, subscribeToWorkerLocation } from '../../sockets/socket';
import { Calendar, Clock, MapPin, Star, User, Phone, MessageSquare, Navigation, Loader2 } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import Chat from '../../components/Chat';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const UserBookings = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [activeChat, setActiveChat] = useState(null); 
  const [trackingWorker, setTrackingWorker] = useState(null); 
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showReviewModal, setShowReviewModal] = useState(null);
  const [showGuaranteeModal, setShowGuaranteeModal] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [guaranteeReason, setGuaranteeReason] = useState('');

  useEffect(() => {
    fetchBookings();
    
    const cleanupStatus = subscribeToBookingUpdates(() => {
      fetchBookings();
    });

    const cleanupLocation = subscribeToWorkerLocation((data) => {
      setTrackingWorker(data);
    });

    return () => {
      cleanupStatus();
      cleanupLocation();
    };
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingAPI.getUserBookings();
      setBookings(response.data);
    } catch (error) {
      console.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleClaimGuarantee = async () => {
    try {
      await bookingAPI.claimGuarantee(showGuaranteeModal._id, guaranteeReason);
      alert('Guarantee claimed! Payment has been frozen.');
      setShowGuaranteeModal(null);
      fetchBookings();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to claim guarantee');
    }
  };

  const handleSubmitReview = async () => {
    try {
      await bookingAPI.submitReview(showReviewModal._id, reviewForm);
      alert('Review submitted! Thank you.');
      setShowReviewModal(null);
      fetchBookings();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit review');
    }
  };

  const isWithin24Hours = (completedAt) => {
    if (!completedAt) return false;
    const completedDate = new Date(completedAt);
    return (Date.now() - completedDate.getTime()) < 24 * 60 * 60 * 1000;
  };

  const tabs = [
    { id: 'all', label: 'All', count: bookings.length },
    { id: 'scheduled', label: 'Scheduled', count: bookings.filter(b => b.status === 'scheduled').length },
    { id: 'accepted', label: 'Accepted', count: bookings.filter(b => b.status === 'accepted').length },
    { id: 'in_progress', label: 'In Progress', count: bookings.filter(b => b.status === 'in_progress').length },
    { id: 'completed', label: 'Completed', count: bookings.filter(b => b.status === 'completed').length }
  ];

  const filteredBookings = activeTab === 'all'
    ? bookings
    : bookings.filter(booking => booking.status === activeTab);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'in_progress': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'accepted': return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
      case 'scheduled': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'cancelled': return 'text-red-400 bg-red-500/10 border-red-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-slate-400">
        <Loader2 size={40} className="animate-spin text-blue-500" />
        <p className="font-bold tracking-widest uppercase text-xs">Syncing Live Status...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-white">My Service History</h1>
          <p className="text-slate-400">Manage your bookings and track live professional status.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 rounded-full border border-blue-500/20">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Real-time Enabled</span>
        </div>
      </div>

      <div className="flex space-x-1 bg-white/5 p-1 rounded-xl w-fit border border-white/5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-2 px-6 rounded-lg text-xs font-bold transition-all uppercase tracking-tighter ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {tab.label} <span className="ml-1 opacity-50">({tab.count})</span>
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {filteredBookings.length === 0 ? (
          <Card className="p-16 text-center bg-transparent border-dashed border-2 border-white/5">
            <Calendar size={48} className="mx-auto text-slate-600 mb-4 opacity-30" />
            <h3 className="text-xl font-semibold text-white mb-2">Empty Booking Queue</h3>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto text-sm">
              Your service history is clean. Book your first professional now to see them here in real-time.
            </p>
            <Button onClick={() => window.location.href = '/user/book'}>
              Hire Professional Now
            </Button>
          </Card>
        ) : (
          filteredBookings.map((booking) => (
            <Card key={booking._id} className="p-6 hover:border-blue-500/30 transition-all group">
              <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
                <div className="flex items-start space-x-5 flex-1">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/10 group-hover:scale-105 transition-transform">
                    <User size={32} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-black text-white capitalize">{booking.service}</h3>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(booking.status)}`}>
                        {booking.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4 mt-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                      <div className="flex items-center text-slate-300">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center mr-3">
                          <User size={14} className="text-blue-400" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Worker</p>
                          <span className="text-sm font-bold">{booking.worker?.user?.name || 'Assigned Professional'}</span>
                        </div>
                      </div>

                      <div className="flex items-center text-slate-300">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center mr-3">
                          <Clock size={14} className="text-blue-400" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Scheduled</p>
                          <span className="text-sm font-bold">{new Date(booking.scheduledDate).toLocaleDateString()} • {booking.scheduledTime}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setActiveChat({
                          bookingId: booking._id,
                          receiverId: booking.worker?.user?._id,
                          receiverName: booking.worker?.user?.name || 'Professional'
                        })}
                      >
                        <MessageSquare size={16} className="mr-2" />
                        Live Chat
                      </Button>

                      {(booking.status === 'in_progress' || booking.status === 'accepted') && (
                        <Button
                          size="sm"
                          onClick={() => setShowTrackingModal(true)}
                          className="bg-blue-600 hover:bg-blue-500"
                        >
                          <Navigation size={16} className="mr-2" />
                          Track Live
                        </Button>
                      )}

                      {booking.status === 'completed' && !booking.guarantee?.isClaimed && isWithin24Hours(booking.tracking?.completedAt) && (
                        <Button
                          variant="secondary"
                          size="sm"
                          className="text-red-400 hover:bg-red-400/10 border-red-500/20"
                          onClick={() => setShowGuaranteeModal(booking)}
                        >
                          Claim Guarantee
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right lg:border-l border-white/10 lg:pl-6 h-full flex flex-col justify-between">
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Fee</p>
                    <div className="text-3xl font-black text-white">₹{booking.price?.total || 450}</div>
                    {booking.paymentStatus === 'frozen' && (
                      <span className="text-[8px] font-black uppercase text-red-500 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">Payment Frozen</span>
                    )}
                  </div>
                  {booking.status === 'completed' && (
                    <button 
                      onClick={() => setShowReviewModal(booking)}
                      className="mt-4 flex items-center justify-end text-yellow-400 hover:scale-105 transition-transform"
                    >
                      <Star size={16} className="fill-yellow-400 mr-1" />
                      <span className="text-xs font-bold">Rate Service</span>
                    </button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Guarantee Modal */}
      <Modal
        isOpen={!!showGuaranteeModal}
        onClose={() => setShowGuaranteeModal(null)}
        title="24-Hour Service Guarantee"
      >
        <div className="space-y-6">
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
            <h4 className="text-red-400 font-bold mb-2 flex items-center gap-2">
              <Clock size={16} /> Action Required
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Claiming a guarantee will instantly **FREEZE** the payment to the provider. Our team will review your case within 4 hours.
            </p>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Reason for dissatisfaction</label>
            <textarea 
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white"
              rows={3}
              placeholder="e.g. Work quality was poor, arrived late..."
              value={guaranteeReason}
              onChange={(e) => setGuaranteeReason(e.target.value)}
            />
          </div>
          <Button variant="danger" className="w-full" onClick={handleClaimGuarantee}>
            Freeze Payment & Claim
          </Button>
        </div>
      </Modal>

      {/* Review Modal */}
      <Modal
        isOpen={!!showReviewModal}
        onClose={() => setShowReviewModal(null)}
        title={`Rate ${showReviewModal?.worker?.user?.name}`}
      >
        <div className="space-y-6">
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} onClick={() => setReviewForm({ ...reviewForm, rating: star })}>
                <Star size={32} className={star <= reviewForm.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-700'} />
              </button>
            ))}
          </div>
          <textarea 
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white"
            rows={3}
            placeholder="Tell us about your experience..."
            value={reviewForm.comment}
            onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
          />
          <Button className="w-full" onClick={handleSubmitReview}>
            Submit Review
          </Button>
        </div>
      </Modal>

      {/* Tracking Modal */}
      <Modal
        isOpen={showTrackingModal}
        onClose={() => setShowTrackingModal(false)}
        title="Real-Time GPS Tracking"
        size="xl"
      >
        <div className="space-y-4">
          <div className="h-96 rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative">
            <MapContainer
              center={trackingWorker ? [trackingWorker.latitude, trackingWorker.longitude] : [28.6139, 77.2090]}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              <Marker position={[28.6139, 77.2090]}>
                <Popup>
                  <div className="font-bold text-slate-900 text-xs">Your Location</div>
                </Popup>
              </Marker>

              {trackingWorker && (
                <Marker position={[trackingWorker.latitude, trackingWorker.longitude]}>
                  <Popup>
                    <div className="font-bold text-blue-600 text-xs">Worker is here!</div>
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          </div>
          <Button onClick={() => setShowTrackingModal(false)} className="w-full">
            Back to Dashboard
          </Button>
        </div>
      </Modal>

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

export default UserBookings;