import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext(null);

const initialNotifications = [
  {
    id: 'notif-1',
    title: 'Emergency Invitation',
    message: 'City Care Hospital requested O+ blood 3.2 km away.',
    time: '15 mins ago',
    read: false,
    type: 'emergency',
    link: '/donor'
  },
  {
    id: 'notif-2',
    title: 'Candidate Accepted',
    message: 'Rank #1 donor accepted Request #req-1.',
    time: '1 hour ago',
    read: false,
    type: 'status',
    link: '/hospital'
  },
  {
    id: 'notif-3',
    title: 'Verification Complete',
    message: 'Your hospital blood coordination badge is active.',
    time: 'Yesterday',
    read: true,
    type: 'info',
    link: '/hospital'
  }
];

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(initialNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const addNotification = (item) => {
    const newItem = {
      id: `notif-${Date.now()}`,
      time: 'Just now',
      read: false,
      ...item
    };
    setNotifications((prev) => [newItem, ...prev]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        addNotification
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export default NotificationContext;
