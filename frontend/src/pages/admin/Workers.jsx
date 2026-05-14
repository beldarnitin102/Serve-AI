import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Search, Shield, CheckCircle2, AlertTriangle } from 'lucide-react';

const AdminWorkers = () => {
  const [filter, setFilter] = useState('all');

  const workers = [
    { id: 1, name: 'Michael Ford', service: 'Plumbing', status: 'verified', rating: 4.9, jobsCompleted: 158 },
    { id: 2, name: 'Lina Gomez', service: 'Electrical', status: 'pending', rating: 4.7, jobsCompleted: 92 },
    { id: 3, name: 'Avery Brown', service: 'Cleaning', status: 'verified', rating: 4.8, jobsCompleted: 123 }
  ];

  const filteredWorkers = workers.filter((worker) =>
    filter === 'all' || worker.status === filter
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Worker Management</h1>
        <p className="text-slate-300">Approve new experts, verify credentials, and maintain quality standards.</p>
      </div>

      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Search size={18} className="text-slate-400" />
            <input
              placeholder="Search workers..."
              className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-xl ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-white/5 text-slate-300'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('verified')}
              className={`px-4 py-2 rounded-xl ${filter === 'verified' ? 'bg-green-500 text-white' : 'bg-white/5 text-slate-300'}`}
            >
              Verified
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-xl ${filter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-white/5 text-slate-300'}`}
            >
              Pending
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredWorkers.map((worker) => (
            <div key={worker.id} className="p-4 bg-slate-900/80 rounded-3xl border border-white/10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">{worker.name}</h3>
                  <p className="text-slate-400 text-sm">{worker.service} • {worker.jobsCompleted} jobs completed</p>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="px-3 py-1 rounded-full bg-white/5 text-slate-300">{worker.rating} ★</span>
                  <span className={`px-3 py-1 rounded-full border ${worker.status === 'verified' ? 'border-green-400 text-green-400' : 'border-yellow-400 text-yellow-400'}`}>
                    {worker.status}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button variant="secondary" size="sm">View Profile</Button>
                {worker.status === 'pending' ? (
                  <Button size="sm">Approve</Button>
                ) : (
                  <Button variant="secondary" size="sm">Suspend</Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AdminWorkers;
