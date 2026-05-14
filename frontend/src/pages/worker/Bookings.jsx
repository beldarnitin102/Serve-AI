import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Calendar, Clock, MapPin, Star, Users, Phone, MessageSquare, CheckCircle, XCircle } from 'lucide-react';

const WorkerBookings = () => {
  const [activeTab, setActiveTab] = useState('active');

  // Mock data - in real app, fetch from API
  const [bookings, setBookings] = useState([
    {
      id: 1,
      service: 'Plumbing',
      customer: {
        name: 'John Smith',
        rating: 4.8,
        phone: '+1234567890',
        image: null
      },
      date: '2024-01-20',
      time: '10:00 AM',
      location: '123 Main St, City',
      status: 'in_progress',
      amount: 150,
      description: 'Leaking kitchen faucet repair',
      customerNotes: 'Please bring your own tools. Parking available on street.',
      estimatedDuration: '1-2 hours'
    },
    {
      id: 2,
      service: 'Electrical',
      customer: {
        name: 'Sarah Johnson',
        rating: 4.9,
        phone: '+1234567891',
        image: null
      },
      date: '2024-01-18',
      time: '2:00 PM',
      location: '456 Oak Ave, City',
      status: 'completed',
      amount: 200,
      description: 'Install new outlet in living room',
      customerNotes: 'Outlet should be placed above the desk',
      estimatedDuration: '2-3 hours',
      actualDuration: '2.5 hours',
      rating: 5,
      review: 'Excellent work! Very professional and punctual.'
    },
    {
      id: 3,
      service: 'Cleaning',
      customer: {
        name: 'Mike Davis',
        rating: 4.7,
        phone: '+1234567892',
        image: null
      },
      date: '2024-01-25',
      time: '9:00 AM',
      location: '789 Pine Rd, City',
      status: 'scheduled',
      amount: 120,
      description: 'Deep house cleaning',
      customerNotes: 'Focus on kitchen and bathrooms. All supplies provided.',
      estimatedDuration: '3-4 hours'
    },
    {
      id: 4,
      service: 'Carpentry',
      customer: {
        name: 'Emma Wilson',
        rating: 4.6,
        phone: '+1234567893',
        image: null
      },
      date: '2024-01-15',
      time: '1:00 PM',
      location: '321 Elm St, City',
      status: 'cancelled',
      amount: 180,
      description: 'Repair broken cabinet door',
      customerNotes: 'Customer cancelled due to change of plans',
      estimatedDuration: '1-2 hours'
    }
  ]);

  const tabs = [
    { id: 'active', label: 'Active', count: bookings.filter(b => ['scheduled', 'in_progress'].includes(b.status)).length },
    { id: 'completed', label: 'Completed', count: bookings.filter(b => b.status === 'completed').length },
    { id: 'cancelled', label: 'Cancelled', count: bookings.filter(b => b.status === 'cancelled').length }
  ];

  const filteredBookings = activeTab === 'active'
    ? bookings.filter(booking => ['scheduled', 'in_progress'].includes(booking.status))
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

  const handleCompleteJob = (bookingId) => {
    // In real app, call API to complete job
    alert('Job marked as completed! Customer will be notified.');
    setBookings(bookings.map(booking =>
      booking.id === bookingId
        ? { ...booking, status: 'completed', actualDuration: '2 hours' }
        : booking
    ));
  };

  const handleContactCustomer = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  const handleStartJob = (bookingId) => {
    // In real app, call API to start job
    alert('Job started! Good luck!');
    setBookings(bookings.map(booking =>
      booking.id === bookingId
        ? { ...booking, status: 'in_progress' }
        : booking
    ));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
        <p className="text-slate-300">
          Manage your scheduled jobs and track your work history.
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
            <p className="text-slate-400">
              {activeTab === 'active'
                ? "You don't have any active bookings."
                : `No ${activeTab} bookings found.`
              }
            </p>
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
                        <span className="font-medium">{booking.customer.name}</span>
                        <div className="flex items-center ml-4 text-yellow-400">
                          <Star size={14} className="mr-1" />
                          <span className="text-sm">{booking.customer.rating}</span>
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

                      <div className="flex items-center text-slate-400 text-sm">
                        <Clock size={14} className="mr-2" />
                        Est. {booking.estimatedDuration}
                        {booking.actualDuration && ` • Actual: ${booking.actualDuration}`}
                      </div>

                      <p className="text-slate-300 text-sm">{booking.description}</p>

                      {booking.customerNotes && (
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mt-3">
                          <p className="text-blue-400 text-sm font-medium mb-1">Customer Notes:</p>
                          <p className="text-slate-300 text-sm">{booking.customerNotes}</p>
                        </div>
                      )}

                      {booking.status === 'completed' && booking.review && (
                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mt-3">
                          <div className="flex items-center mb-2">
                            <Star size={16} className="text-yellow-400 mr-1" />
                            <span className="text-green-400 text-sm font-medium">Customer Review: {booking.rating}/5</span>
                          </div>
                          <p className="text-slate-300 text-sm">"{booking.review}"</p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleContactCustomer(booking.customer.phone)}
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
                          size="sm"
                          onClick={() => handleStartJob(booking.id)}
                        >
                          Start Job
                        </Button>
                      )}

                      {booking.status === 'in_progress' && (
                        <Button
                          size="sm"
                          onClick={() => handleCompleteJob(booking.id)}
                        >
                          <CheckCircle size={16} className="mr-2" />
                          Complete Job
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold">${booking.amount}</div>
                  <div className="text-slate-400 text-sm mt-1">Earnings</div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Earnings Summary */}
      {activeTab === 'completed' && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-6">Earnings Summary</h3>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">
                ${filteredBookings.reduce((sum, booking) => sum + booking.amount, 0)}
              </div>
              <div className="text-slate-400 text-sm">Total Earnings</div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {filteredBookings.length}
              </div>
              <div className="text-slate-400 text-sm">Jobs Completed</div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {filteredBookings.length > 0
                  ? (filteredBookings.reduce((sum, booking) => sum + (booking.rating || 0), 0) / filteredBookings.filter(b => b.rating).length).toFixed(1)
                  : '0.0'
                }
              </div>
              <div className="text-slate-400 text-sm">Average Rating</div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">
                ${filteredBookings.length > 0 ? Math.round(filteredBookings.reduce((sum, booking) => sum + booking.amount, 0) / filteredBookings.length) : 0}
              </div>
              <div className="text-slate-400 text-sm">Average per Job</div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default WorkerBookings;