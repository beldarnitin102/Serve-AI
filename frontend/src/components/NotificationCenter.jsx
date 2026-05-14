import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Clock, Info, AlertTriangle, Trash2 } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const NotificationCenter = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications(user?._id);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'new_booking': return <Clock size={16} className="text-blue-400" />;
      case 'booking_update': return <Check size={16} className="text-green-400" />;
      case 'payment': return <Info size={16} className="text-purple-400" />;
      case 'verification': return <AlertTriangle size={16} className="text-yellow-400" />;
      default: return <Bell size={16} className="text-slate-400" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
      >
        <Bell size={20} className={`${unreadCount > 0 ? 'text-blue-400' : 'text-slate-300'}`} />
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-red-500 text-[8px] font-black flex items-center justify-center rounded-full border-2 border-[#071226] animate-bounce">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-[#0f172a]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-[100] overflow-hidden">
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
            <h3 className="font-bold text-white text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-[10px] font-black uppercase text-red-400 hover:text-red-300 flex items-center gap-1"
              >
                <Trash2 size={10} />
                Clear All
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-10 text-center text-slate-500">
                <Bell size={32} className="mx-auto mb-3 opacity-10" />
                <p className="text-xs font-bold">No new alerts</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif._id || notif.id}
                  onClick={() => {
                    markAsRead(notif._id);
                    if (notif.bookingId) navigate('/worker/bookings');
                  }}
                  className={`p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors ${!notif.isRead ? 'bg-blue-500/[0.03]' : ''}`}
                >
                  <div className="flex gap-3">
                    <div className="mt-1">{getIcon(notif.type)}</div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-white">{notif.title}</p>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{notif.message}</p>
                      <p className="text-[9px] text-slate-600 mt-2 font-bold uppercase tracking-widest">
                        {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {!notif.isRead && (
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shadow-[0_0_8px_#3b82f6]" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-3 text-center border-t border-white/10 bg-white/[0.01]">
            <button 
              onClick={() => { navigate('/worker/notifications'); setIsOpen(false); }}
              className="text-[10px] font-black uppercase text-blue-400 hover:text-blue-300 tracking-widest"
            >
              Expand Full History
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
