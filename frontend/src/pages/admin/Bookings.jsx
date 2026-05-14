import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Search, CalendarCheck, Clock, Tag } from 'lucide-react';

const AdminBookings = () => {
  const [filter, setFilter] = useState('all');

  const bookings = [
    { id: 1, service: 'Electrical', customer: 'Rina Patel', worker: 'Lina Gomez', date: '2024-01-20', status: 'scheduled', amount: 200 },
    { id: 2, service: 'Plumbing', customer: 'Alicia Keys', worker: 'Michael Ford', date: '2024-01-18', status: 'in_progress', amount: 150 },
    { id: 3, service: 'Cleaning', customer: 'Mike Davis', worker: 'Avery Brown', date: '2024-01-15', status: 'completed', amount: 120 }
  ];

  const filteredBookings = bookings.filter((booking) =>
    filter === 'all' || booking.status === filter
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Booking Administration</h1>
        <p className="text-slate-300">View and manage bookings across the platform, including urgent jobs and cancellations.</p>
      </div>

      <Card className="p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 w-full lg:w-96">
            <Search size={18} className="text-slate-400" />
            <input
              placeholder="Search booking ID, customer, or worker..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-xl ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-white/5 text-slate-300'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('scheduled')}
              className={`px-4 py-2 rounded-xl ${filter === 'scheduled' ? 'bg-yellow-500 text-white' : 'bg-white/5 text-slate-300'}`}
            >
              Scheduled
            </button>
            <button
              onClick={() => setFilter('in_progress')}
              className={`px-4 py-2 rounded-xl ${filter === 'in_progress' ? 'bg-blue-500 text-white' : 'bg-white/5 text-slate-300'}`}
            >
              In Progress
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-xl ${filter === 'completed' ? 'bg-green-500 text-white' : 'bg-white/5 text-slate-300'}`}
            >
              Completed
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="text-slate-400 text-sm uppercase tracking-wider">
                <th className="px-4 py-3">Booking</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Worker</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="border border-white/10 rounded-3xl bg-slate-900/80">
                  <td className="px-4 py-4">#{booking.id} • {booking.service}</td>
                  <td className="px-4 py-4">{booking.customer}</td>
                  <td className="px-4 py-4">{booking.worker}</td>
                  <td className="px-4 py-4">{booking.date}</td>
                  <td className="px-4 py-4 capitalize">{booking.status.replace('_', ' ')}</td>
                  <td className="px-4 py-4">${booking.amount}</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      <Button variant="secondary" size="sm">View</Button>
                      <Button size="sm">Update</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AdminBookings;
