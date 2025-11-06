import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, MessageCircle, Heart, UserPlus, Award, TrendingUp } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useAuth } from '../contexts/AuthContext';
import './Notifications.css';

const Notifications = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchNotifications();
  }, [isAuthenticated, navigate]);

  const fetchNotifications = async () => {
    // Mock notifications - replace with actual API call
    const mockNotifications = [
      {
        id: '1',
        type: 'upvote',
        user: 'john_doe',
        content: 'upvoted your post',
        postTitle: 'My awesome post title',
        timestamp: new Date(Date.now() - 3600000),
        read: false,
      },
      {
        id: '2',
        type: 'comment',
        user: 'jane_smith',
        content: 'commented on your post',
        postTitle: 'Another great post',
        timestamp: new Date(Date.now() - 7200000),
        read: false,
      },
      {
        id: '3',
        type: 'follow',
        user: 'bob_wilson',
        content: 'started following you',
        timestamp: new Date(Date.now() - 86400000),
        read: true,
      },
      {
        id: '4',
        type: 'award',
        user: 'alice_jones',
        content: 'gave you an award',
        postTitle: 'Helpful tutorial',
        timestamp: new Date(Date.now() - 172800000),
        read: true,
      },
    ];
    
    setNotifications(mockNotifications);
    setLoading(false);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'upvote':
        return <TrendingUp size={20} className="notif-icon upvote" />;
      case 'comment':
        return <MessageCircle size={20} className="notif-icon comment" />;
      case 'follow':
        return <UserPlus size={20} className="notif-icon follow" />;
      case 'award':
        return <Award size={20} className="notif-icon award" />;
      default:
        return <Bell size={20} className="notif-icon" />;
    }
  };

  const getTimeAgo = (timestamp) => {
    const seconds = Math.floor((new Date() - timestamp) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const filteredNotifications = filter === 'all'
    ? notifications
    : notifications.filter(n => !n.read);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="notifications-page">
      <div className="notifications-container">
        <div className="page-header">
          <h1>Notifications</h1>
          <div className="filter-buttons">
            <button
              className={filter === 'all' ? 'active' : ''}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={filter === 'unread' ? 'active' : ''}
              onClick={() => setFilter('unread')}
            >
              Unread
            </button>
          </div>
        </div>

        <Card className="notifications-card">
          {filteredNotifications.length > 0 ? (
            <div className="notifications-list">
              {filteredNotifications.map((notif, index) => (
                <motion.div
                  key={notif.id}
                  className={`notification-item ${!notif.read ? 'unread' : ''}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="notif-icon-wrapper">
                    {getIcon(notif.type)}
                  </div>
                  <div className="notif-content">
                    <p>
                      <Link to={`/u/${notif.user}`} className="notif-user">
                        u/{notif.user}
                      </Link>{' '}
                      {notif.content}
                      {notif.postTitle && (
                        <>
                          {' '}
                          <span className="notif-post">"{notif.postTitle}"</span>
                        </>
                      )}
                    </p>
                    <span className="notif-time">{getTimeAgo(notif.timestamp)}</span>
                  </div>
                  {!notif.read && <div className="unread-dot"></div>}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Bell size={48} />
              <p>No notifications</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Notifications;
