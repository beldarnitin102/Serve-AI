import React from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Bell, CheckCircle, AlertTriangle } from 'lucide-react';

const Notifications = () => {
  const notifications = [
    { id: 1, title: 'Booking confirmed', description: 'Your electrician appointment is scheduled for Jan 20 at 10:00 AM.', type: 'success', time: '2h ago' },
    { id: 2, title: 'Emergency response guaranteed', description: 'A plumber is on the way to your urgent request.', type: 'alert', time: '4h ago' },
    { id: 3, title: 'New discount available', description: 'Get 15% off home cleaning this weekend.', type: 'info', time: '1 day ago' }
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
        <p className="text-slate-300">Stay on top of booking updates, service alerts, and special offers.</p>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">Recent notifications</h2>
            <p className="text-slate-400 text-sm">Review your latest account activity and service alerts.</p>
          </div>
          <Button variant="secondary">Mark all read</Button>
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
