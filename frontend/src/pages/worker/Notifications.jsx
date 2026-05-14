import React from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Bell, CheckCircle, AlertTriangle } from 'lucide-react';

const Notifications = () => {
  const notifications = [
    { id: 1, title: 'New job offer', description: 'A nearby service request is ready for you to accept.', type: 'success', time: '10m ago' },
    { id: 2, title: 'Payment received', description: 'You earned $150 from a completed Plumbing job.', type: 'success', time: '1h ago' },
    { id: 3, title: 'Low availability', description: 'Your profile is low on availability slots. Update your schedule.', type: 'alert', time: 'Yesterday' }
  ];

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle size={20} className="text-green-400" />;
      case 'alert': return <AlertTriangle size={20} className="text-yellow-400" />;
      default: return <Bell size={20} className="text-blue-400" />;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Notifications</h1>
        <p className="text-slate-300">Receive updates on job offers, payments, and account alerts.</p>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">Alerts</h2>
            <p className="text-slate-400 text-sm">Keep track of your most important updates.</p>
          </div>
          <Button variant="secondary">Clear all</Button>
        </div>

        <div className="space-y-4">
          {notifications.map((notification) => (
            <div key={notification.id} className="p-4 rounded-3xl bg-slate-900/80 border border-white/10 flex items-start gap-4">
              <div className="mt-1">{getIcon(notification.type)}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-semibold">{notification.title}</h3>
                  <span className="text-slate-500 text-xs">{notification.time}</span>
                </div>
                <p className="text-slate-400 text-sm mt-1">{notification.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Notifications;
