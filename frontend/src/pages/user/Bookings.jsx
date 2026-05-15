import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { bookingAPI } from '../../services/api';
import { subscribeToBookingUpdates } from '../../sockets/socket';
import { Calendar, Clock, Star, User, MessageSquare, Navigation, Loader2, ShieldAlert, CheckCircle, Lock } from 'lucide-react';
import Chat from '../../components/Chat';

// Helper: safely get string from location field (could be string or object)
const getLocationString = (location) => {
  if (!location) return 'N/A';
  if (typeof location === 'string') return location;
  if (typeof location === 'object') return location.address || 'N/A';
  return 'N/A';
};

// Helper: safely get string from scheduledTime field (could be string or object)
const getTimeString = (scheduledTime) => {
  if (!scheduledTime) return 'N/A';
  if (typeof scheduledTime === 'string') return scheduledTime;
  if (typeof scheduledTime === 'object') return scheduledTime.start || 'N/A';
  return 'N/A';
};

// Helper: check if a completed job is within the 24-hour guarantee window
const isWithin24Hours = (completedAt) => {
  if (!completedAt) return false;
  return (Date.now() - new Date(completedAt).getTime()) < 24 * 60 * 60 * 1000;
};

const UserBookings = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState(null);

  // Guarantee modal state
  const [showGuaranteeModal, setShowGuaranteeModal] = useState(null);
  const [guaranteeReason, setGuaranteeReason] = useState('');
  const [claimingGuarantee, setClaimingGuarantee] = useState(false);

  // Review modal state
  const [showReviewModal, setShowReviewModal] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    fetchBookings();
    const cleanup = subscribeToBookingUpdates(() => fetchBookings());
    return () => cleanup();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingAPI.getUserBookings();
      setBookings(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimGuarantee = async () => {
    if (!guaranteeReason.trim()) {
      alert('Please provide a reason for claiming the guarantee.');
      return;
    }
    setClaimingGuarantee(true);
    try {
      await bookingAPI.claimGuarantee(showGuaranteeModal._id, guaranteeReason);
      setShowGuaranteeModal(null);
      setGuaranteeReason('');
      await fetchBookings();
      alert('✅ Guarantee claimed! Payment has been frozen. Our team will review your case within 4 hours.');
    } catch (error) {
      alert('❌ ' + (error.response?.data?.message || 'Failed to claim guarantee. Please try again.'));
    } finally {
      setClaimingGuarantee(false);
    }
  };

  const handleSubmitReview = async () => {
    try {
      await bookingAPI.submitReview(showReviewModal._id, reviewForm);
      setShowReviewModal(null);
      setReviewForm({ rating: 5, comment: '' });
      await fetchBookings();
      alert('✅ Review submitted! Thank you.');
    } catch (error) {
      alert('❌ ' + (error.response?.data?.message || 'Failed to submit review.'));
    }
  };

  const tabs = [
    { id: 'all', label: 'All', count: bookings.length },
    { id: 'pending', label: 'Pending', count: bookings.filter(b => b.status === 'pending').length },
    { id: 'accepted', label: 'Accepted', count: bookings.filter(b => b.status === 'accepted').length },
    { id: 'in_progress', label: 'In Progress', count: bookings.filter(b => b.status === 'in_progress').length },
    { id: 'completed', label: 'Completed', count: bookings.filter(b => b.status === 'completed').length },
  ];

  const filteredBookings = activeTab === 'all'
    ? bookings
    : bookings.filter(b => b.status === activeTab);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'in_progress': return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'accepted': return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30';
      case 'pending': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'cancelled': return 'text-red-400 bg-red-500/10 border-red-500/30';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-slate-400">
        <Loader2 size={40} className="animate-spin text-blue-500" />
        <p className="font-bold tracking-widest uppercase text-xs">Loading Bookings...</p>
      </div>
    );
  }

  if (activeChat) {
    return (
      <div className="space-y-4">
        <Button variant="secondary" size="sm" onClick={() => setActiveChat(null)}>← Back to Bookings</Button>
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-white">My Service History</h1>
          <p className="text-slate-400">Track all your bookings and claim guarantees for unsatisfied services.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 rounded-full border border-blue-500/20">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Real-time</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-2 px-5 rounded-lg text-xs font-bold transition-all uppercase tracking-tight ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5'
            }`}
          >
            {tab.label} <span className="ml-1 opacity-60">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="space-y-6">
        {filteredBookings.length === 0 ? (
          <Card className="p-16 text-center border-dashed border-2 border-white/5 bg-transparent">
            <Calendar size={48} className="mx-auto text-slate-600 mb-4 opacity-30" />
            <h3 className="text-xl font-semibold text-white mb-2">No bookings found</h3>
            <p className="text-slate-500 text-sm">No bookings in this category yet.</p>
          </Card>
        ) : (
          filteredBookings.map((booking) => {
            const canClaimGuarantee =
              booking.status === 'completed' &&
              !booking.guarantee?.isClaimed &&
              isWithin24Hours(booking.tracking?.completedAt);

            return (
              <Card key={booking._id} className="p-6 hover:border-blue-500/30 transition-all group">
                <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
                  {/* Left: Details */}
                  <div className="flex items-start space-x-5 flex-1">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center text-white shadow-xl flex-shrink-0">
                      <User size={28} />
                    </div>
                    <div className="flex-1 min-w-0">
                      {/* Title + Status + Frozen Badge */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <h3 className="text-xl font-black text-white capitalize">{booking.service}</h3>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(booking.status)}`}>
                          {booking.status.replace('_', ' ')}
                        </span>
                        {booking.paymentStatus === 'frozen' && (
                          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border bg-red-500/10 text-red-400 border-red-500/30 flex items-center gap-1">
                            <Lock size={10} /> Payment Frozen
                          </span>
                        )}
                        {booking.guarantee?.isClaimed && (
                          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border bg-orange-500/10 text-orange-400 border-orange-500/30">
                            Guarantee Claimed
                          </span>
                        )}
                      </div>

                      {/* Info Grid */}
                      <div className="grid sm:grid-cols-2 gap-3 mb-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                        <div>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Worker</p>
                          <p className="text-sm font-bold text-white">{booking.worker?.user?.name || 'Assigned Professional'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Scheduled</p>
                          <p className="text-sm font-bold text-white">
                            {new Date(booking.scheduledDate).toLocaleDateString()} • {getTimeString(booking.scheduledTime)}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Location</p>
                          <p className="text-sm font-bold text-white truncate">{getLocationString(booking.location)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Amount</p>
                          <p className="text-sm font-bold text-white">₹{booking.price?.total || 450}</p>
                        </div>
                      </div>

                      {/* Action Buttons */}
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
                          <MessageSquare size={14} className="mr-2" />
                          Chat
                        </Button>

                        {canClaimGuarantee && (
                          <Button
                            size="sm"
                            onClick={() => { setShowGuaranteeModal(booking); setGuaranteeReason(''); }}
                            className="bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-500/30"
                          >
                            <ShieldAlert size={14} className="mr-2" />
                            Claim 24h Guarantee
                          </Button>
                        )}

                        {booking.status === 'completed' && !booking.guarantee?.isClaimed && (
                          <button
                            onClick={() => setShowReviewModal(booking)}
                            className="flex items-center text-yellow-400 hover:scale-105 transition-transform text-xs font-bold"
                          >
                            <Star size={14} className="fill-yellow-400 mr-1" />
                            Rate Service
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* ===== 24-HOUR GUARANTEE MODAL ===== */}
      <Modal
        isOpen={!!showGuaranteeModal}
        onClose={() => { setShowGuaranteeModal(null); setGuaranteeReason(''); }}
        title="24-Hour Service Guarantee"
      >
        <div className="space-y-5">
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
            <h4 className="text-red-400 font-bold mb-2 flex items-center gap-2">
              <ShieldAlert size={16} /> What happens when you claim?
            </h4>
            <ul className="text-xs text-slate-300 space-y-1 leading-relaxed">
              <li>• Payment to the provider will be <strong className="text-red-400">instantly frozen</strong></li>
              <li>• Our team will review your case within <strong>4 hours</strong></li>
              <li>• You will receive a full refund if your claim is valid</li>
              <li>• The provider will be notified immediately</li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Service</p>
            <p className="text-white font-bold capitalize">{showGuaranteeModal?.service}</p>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">
              Reason for dissatisfaction <span className="text-red-400">*</span>
            </label>
            <textarea
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-blue-500 resize-none"
              rows={4}
              placeholder="e.g. Work quality was poor, the worker arrived very late, the job was left incomplete..."
              value={guaranteeReason}
              onChange={(e) => setGuaranteeReason(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => { setShowGuaranteeModal(null); setGuaranteeReason(''); }}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-red-600 hover:bg-red-500 text-white"
              onClick={handleClaimGuarantee}
              disabled={claimingGuarantee || !guaranteeReason.trim()}
            >
              {claimingGuarantee ? (
                <><Loader2 size={14} className="animate-spin mr-2" />Freezing Payment...</>
              ) : (
                <><Lock size={14} className="mr-2" />Freeze Payment & Claim</>
              )}
            </Button>
          </div>
        </div>
      </Modal>

      {/* ===== REVIEW MODAL ===== */}
      <Modal
        isOpen={!!showReviewModal}
        onClose={() => setShowReviewModal(null)}
        title="Rate Your Experience"
      >
        <div className="space-y-5">
          <div className="flex justify-center gap-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                className="transition-transform hover:scale-110"
              >
                <Star size={36} className={star <= reviewForm.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-700'} />
              </button>
            ))}
          </div>
          <textarea
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-blue-500 resize-none"
            rows={3}
            placeholder="Tell us about your experience..."
            value={reviewForm.comment}
            onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
          />
          <Button className="w-full" onClick={handleSubmitReview}>
            <CheckCircle size={14} className="mr-2" /> Submit Review
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default UserBookings;