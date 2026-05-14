import React from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { AlertTriangle, Shield, Clock } from 'lucide-react';

const Emergency = () => {
  const emergencies = [
    { id: 1, service: 'Plumbing', location: '123 Main St', urgency: 'High', time: '10m ago' },
    { id: 2, service: 'Electrical', location: '452 Oak Ave', urgency: 'Medium', time: '30m ago' }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Emergency Dispatch</h1>
        <p className="text-slate-300">Monitor real-time emergency requests and route priority workers quickly.</p>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">Incoming emergency requests</h2>
            <p className="text-slate-400 text-sm">These jobs require immediate attention from verified workers.</p>
          </div>
          <Button variant="secondary">Refresh</Button>
        </div>

        <div className="space-y-4">
          {emergencies.map((item) => (
            <div key={item.id} className="p-4 rounded-3xl bg-slate-900/80 border border-white/10 grid gap-3 md:grid-cols-3 items-center">
              <div>
                <h3 className="font-semibold">{item.service}</h3>
                <p className="text-slate-400 text-sm">{item.location}</p>
              </div>
              <div className="text-slate-400">Urgency: <span className="text-yellow-400">{item.urgency}</span></div>
              <div className="flex items-center justify-end gap-3">
                <Button variant="secondary" size="sm">Assign</Button>
                <Button size="sm">Details</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <Shield size={24} className="text-purple-400" />
          <div>
            <h2 className="text-xl font-semibold">Response readiness</h2>
            <p className="text-slate-400 text-sm">Track worker response times and emergency coverage metrics.</p>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="p-4 rounded-3xl bg-slate-900/80 border border-white/10">
            <p className="text-slate-300 font-medium">Average ETA</p>
            <p className="text-3xl font-bold text-blue-400">12m</p>
          </div>
          <div className="p-4 rounded-3xl bg-slate-900/80 border border-white/10">
            <p className="text-slate-300 font-medium">Coverage rate</p>
            <p className="text-3xl font-bold text-green-400">97%</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Emergency;
