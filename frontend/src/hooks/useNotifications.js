import { useState, useEffect } from 'react';
import { notificationAPI } from '../services/api';
import socket, { subscribeToBookingUpdates, subscribeToNewBookings } from '../sockets/socket';

export const useNotifications = (userId) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    
    const cleanupBooking = subscribeToBookingUpdates((data) => {
      addNotification({
        title: 'Booking Update',
        message: data.message,
        type: 'booking_update'
      });
    });

    const cleanupNew = subscribeToNewBookings((data) => {
      addNotification({
        title: 'New Booking Request',
        message: data.message,
        type: 'new_booking'
      });
    });

    return () => {
      cleanupBooking();
      cleanupNew();
    };
  }, [userId]);

  const fetchNotifications = async () => {
    try {
      const response = await notificationAPI.getAll();
      setNotifications(response.data);
      setUnreadCount(response.data.filter(n => !n.isRead).length);
    } catch (error) {
      console.error('Failed to fetch notifications');
    }
  };

  const addNotification = (notif) => {
    const newNotif = {
      ...notif,
      id: Date.now(),
      createdAt: new Date(),
      isRead: false
    };
    setNotifications(prev => [newNotif, ...prev]);
    setUnreadCount(prev => prev + 1);
    
    // Optional: play sound
    const audio = new Audio('/notification.mp3');
    audio.play().catch(e => console.log('Audio play failed'));
  };

  const markAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read');
    }
  };

  return { notifications, unreadCount, markAsRead, markAllAsRead, fetchNotifications };
};
