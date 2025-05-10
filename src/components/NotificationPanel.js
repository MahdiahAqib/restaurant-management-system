import { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import Cookies from 'js-cookie';
import styles from '../styles/NotificationPanel.module.css';

export default function NotificationPanel() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    // Set up polling for new notifications
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const userCookie = Cookies.get('user');
      let userId = '';
      if (userCookie) {
        try {
          const user = JSON.parse(userCookie);
          // Try all possible ID fields
          userId = user._id || user.id || user.userId;
          if (!userId) {
            console.error('No user ID found in cookie');
            return;
          }
        } catch (e) {
          console.error('Error parsing user cookie:', e);
          return;
        }
      }
      const response = await fetch(`/api/notifications?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      const data = await response.json();
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.isRead).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await fetch(`/api/notifications/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isRead: true }),
      });
      
      // Update local state immediately
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification._id === id 
            ? { ...notification, isRead: true }
            : notification
        )
      );
      
      // Update unread count
      setUnreadCount(prevCount => Math.max(0, prevCount - 1));
      
      // Refresh notifications after a short delay
      setTimeout(fetchNotifications, 500);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <div className={styles.notificationPanel}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={styles.notificationButton}
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className={styles.unreadDot}></span>
        )}
      </button>

      {isOpen && (
        <div className={styles.notificationDropdown}>
          <div className={styles.notificationHeader}>
            <h3 className={styles.notificationTitle}>Notifications</h3>
            <button
              onClick={() => setIsOpen(false)}
              className={styles.closeButton}
            >
              <X size={20} />
            </button>
          </div>
          <div className={styles.notificationList}>
            {notifications.length === 0 ? (
              <div className={styles.emptyNotification}>
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`${styles.notificationItem} ${
                    !notification.isRead ? styles.unread : ''
                  }`}
                  onClick={() => markAsRead(notification._id)}
                >
                  <div className={styles.notificationContent}>
                    <p className={styles.notificationMessage}>
                      {notification.message}
                    </p>
                    <p className={styles.notificationTime}>
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <span className={styles.unreadDot}></span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
} 