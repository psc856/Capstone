import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  TrendingUp,
  Compass,
  Clock,
  Calendar,
  MessageCircle,
  Award,
  Users,
  BarChart3,
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: TrendingUp, label: 'Trending', path: '/trending' },
    { icon: Compass, label: 'Discover', path: '/discover' },
    { icon: Users, label: 'Communities', path: '/communities' },
    { icon: BarChart3, label: 'Polls', path: '/polls' },
    { icon: Clock, label: 'Time Capsules', path: '/capsules' },
    { icon: Calendar, label: 'Events', path: '/events' },
    { icon: MessageCircle, label: 'Messages', path: '/messages' },
    { icon: Award, label: 'Leaderboard', path: '/leaderboard' },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {isOpen && (
        <div className="sidebar-overlay" onClick={onClose}></div>
      )}
      <motion.aside
        className={`sidebar ${isOpen ? 'open' : ''}`}
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="sidebar-content">
          <nav className="sidebar-nav">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-item ${isActive(item.path) ? 'active' : ''}`}
                onClick={onClose}
              >
                <item.icon size={22} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="sidebar-footer">
            <div className="glass-card small">
              <h4>Welcome to BuChat</h4>
              <p>Your home for communities, discussions, and more!</p>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
