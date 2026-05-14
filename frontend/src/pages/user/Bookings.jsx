import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Calendar, Clock, MapPin, Star, Users, Phone, MessageSquare } from 'lucide-react';

const UserBookings = () => {
  const [activeTab, setActiveTab] = useState('all');

  // Mock data - in real app, fetch from API
  const [bookings, setBookings] = useState([
    {
      id: 1,
      service: 'Plumbing',
      worker: {
        name: 'John Smith',
        rating: 4.8,
        phone: '+1234567890',
        image: null
      },
      date: '2024-01-15',
      time: '14:00',
      location: '123 Main St, City',
      status: 'completed',
      amount: 150,
      description: 'Leaking faucet repair',
      canReview: true
    },
    {
      id: 2,
      service: 'Electrical',
      worker: {
        name: 'Mike Johnson',
        rating: 4.9,
        phone: '+1234567891',
        image: null
      },
      date: '2024-01-20',
      time: '10:00',
      location: '456 Oak Ave, City',
      status: 'in_progress',
      amount: 200,
      description: 'Outlet installation',
      canReview: false
    },
    {
      id: 3,
      service: 'Cleaning',
      worker: {
        name: 'Sarah Davis',
        rating: 4.7,
        phone: '+1234567892',
        image: null
      },
      date: '2024-01-25',
      time: '09:00',
      location: '789 Pine Rd, City',
      status: 'scheduled',
      amount: 120,
      description: 'Deep house cleaning',
      canReview: false
    }
  ]);

  const tabs = [
    { id: 'all', label: 'All Bookings', count: bookings.length },
    { id: 'scheduled', label: 'Scheduled', count: bookings.filter(b => b.status === 'scheduled').length },
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
      case 'scheduled': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'cancelled': return 'text-red-400 bg-red-500/10 border-red-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const formatStatus = (status) => {
    return status.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const handleCancelBooking = (bookingId) => {
    // In real app, call API to cancel booking
    alert('Booking cancelled successfully');
    setBookings(bookings.map(booking =>
      booking.id === bookingId
        ? { ...booking, status: 'cancelled' }
        : booking
    ));
  };

  const handleContactWorker = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  const handleLeaveReview = (bookingId) => {
    // In real app, open review modal
    alert('Review functionality would open here');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
        <p className="text-slate-300">
          Track and manage all your service bookings.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-white/5 p-1 rounded-xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-blue-500 text-white'
                : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="space-y-6">
        {filteredBookings.length === 0 ? (
          <Card className="p-12 text-center">
            <Calendar size={48} className="mx-auto text-slate-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No bookings found</h3>
            <p className="text-slate-400 mb-6">
              {activeTab === 'all'
                ? "You haven't booked any services yet."
                : `No ${activeTab} bookings found.`
              }
            </p>
            <Button onClick={() => window.location.href = '/user/book'}>
              Book Your First Service
            </Button>
          </Card>
        ) : (
          filteredBookings.map((booking) => (
            <Card key={booking.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center">
                    <Users size={32} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold">{booking.service}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                        {formatStatus(booking.status)}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-slate-300">
                        <Users size={16} className="mr-2" />
                        <span className="font-medium">{booking.worker.name}</span>
                        <div className="flex items-center ml-4 text-yellow-400">
                          <Star size={14} className="mr-1" />
                          <span className="text-sm">{booking.worker.rating}</span>
                        </div>
                      </div>

                      <div className="flex items-center text-slate-400 text-sm">
                        <Calendar size={14} className="mr-2" />
                        {booking.date} at {booking.time}
                      </div>

                      <div className="flex items-center text-slate-400 text-sm">
                        <MapPin size={14} className="mr-2" />
                        {booking.location}
                      </div>

                      <p className="text-slate-300 text-sm">{booking.description}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleContactWorker(booking.worker.phone)}
                      >
                        <Phone size={16} className="mr-2" />
                        Call
                      </Button>

                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => alert('Chat functionality would open here')}
                      >
                        <MessageSquare size={16} className="mr-2" />
                        Message
                      </Button>

                      {booking.status === 'scheduled' && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleCancelBooking(booking.id)}
                        >
                          Cancel Booking
                        </Button>
                      )}

                      {booking.canReview && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleLeaveReview(booking.id)}
                        >
                          <Star size={16} className="mr-2" />
                          Leave Review
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold">${booking.amount}</div>
                  <div className="text-slate-400 text-sm mt-1">Total</div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default UserBookings;