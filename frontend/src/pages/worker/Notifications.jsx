import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Bell, CheckCircle, AlertTriangle, Clock, Trash2, Loader2, Info } from 'lucide-react';
import { notificationAPI } from '../../services/api';
import { subscribeToNotifications } from '../../sockets/socket';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    // Subscribe to real-time notifications
    const unsubscribe = subscribeToNotifications((data) => {
      // Add new notification to the top of the list
      setNotifications(prev => [data.notification, ...prev]);
    });

    return unsubscribe;
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await notificationAPI.getAll();
      setNotifications(response.data);
    } catch (error) {
      console.error('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications([]);
    } catch (error) {
      alert('Failed to clear notifications');
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'booking': return <CheckCircle size={20} className="text-green-400" />;
      case 'alert': return <AlertTriangle size={20} className="text-yellow-400" />;
      case 'message': return <Bell size={20} className="text-blue-400" />;
      default: return <Info size={20} className="text-slate-400" />;
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 size={40} className="animate-spin text-blue-500" />
        <p className="text-slate-400 font-medium">Syncing notifications...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent">Notifications</h1>
          <p className="text-slate-400">Stay updated with live job status, payments, and system alerts.</p>
        </div>
        {notifications.length > 0 && (
          <Button 
            variant="secondary" 
            className="border-red-500/20 text-red-400 hover:bg-red-500/10 flex items-center gap-2"
            onClick={handleClearAll}
          >
            <Trash2 size={16} />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid gap-4">
        {notifications.length === 0 ? (
          <Card className="p-20 text-center border-dashed border-2 border-white/5 bg-transparent">
            <Bell size={48} className="mx-auto text-slate-800 mb-6" />
            <h3 className="text-xl font-bold text-slate-600">All caught up!</h3>
            <p className="text-slate-500 text-sm mt-2">New updates will appear here in real-time.</p>
          </Card>
        ) : (
          notifications.map((notification) => (
            <Card key={notification._id} className={`p-6 hover:bg-white/[0.02] transition-all border-none ${!notification.read ? 'bg-blue-500/[0.03]' : 'bg-white/[0.01]'}`}>
              <div className="flex items-start gap-5">
                <div className={`p-3 rounded-2xl ${
                  notification.type === 'booking' ? 'bg-green-500/10' :
                  notification.type === 'alert' ? 'bg-yellow-500/10' : 'bg-blue-500/10'
                }`}>
                  {getIcon(notification.type)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-lg font-bold text-white">{notification.title}</h3>
                    <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                      <Clock size={12} />
                      {new Date(notification.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <p className="text-slate-400 leading-relaxed">{notification.message}</p>
                </div>

                {!notification.read && (
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shadow-[0_0_10px_#3b82f6]" />
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
