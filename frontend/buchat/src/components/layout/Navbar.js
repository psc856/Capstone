import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  Search,
  Plus,
  Bell,
  MessageCircle,
  User,
  Menu,
  X,
  TrendingUp,
  Award,
  Moon,
  Sun,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import Button from '../common/Button';
import './Navbar.css';

const Navbar = ({ onMenuToggle }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowUserMenu(false);
  };

  return (
    <nav className="navbar glass-nav">
      <div className="navbar-container">
        <div className="navbar-left">
          <button
            className="menu-button"
            onClick={onMenuToggle}
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>
          <Link to="/" className="navbar-brand">
            <motion.div
              className="brand-logo"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <TrendingUp size={28} />
            </motion.div>
            <span className="brand-text">BuChat</span>
          </Link>
        </div>

        <form className="navbar-search" onSubmit={handleSearch}>
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search posts, communities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </form>

        <div className="navbar-right">
          <button
            className="nav-icon-button theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          {isAuthenticated ? (
            <>
              <Link to="/create-post" className="nav-icon-button">
                <Plus size={22} />
              </Link>
              <Link to="/notifications" className="nav-icon-button">
                <Bell size={22} />
                {/* <span className="notification-badge">3</span> */}
              </Link>
              <Link to="/messages" className="nav-icon-button">
                <MessageCircle size={22} />
              </Link>
              <Link to="/leaderboard" className="nav-icon-button">
                <Award size={22} />
              </Link>

              <div className="user-menu-container">
                <button
                  className="user-avatar-button"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.username} />
                  ) : (
                    <div className="avatar-placeholder">
                      {user?.username?.[0]?.toUpperCase()}
                    </div>
                  )}
                </button>

                {showUserMenu && (
                  <motion.div
                    className="user-dropdown"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Link
                      to={`/u/${user?.username}`}
                      className="dropdown-item"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User size={18} />
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="dropdown-item"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Settings
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item" onClick={handleLogout}>
                      Logout
                    </button>
                  </motion.div>
                )}
              </div>
            </>
          ) : (
            <>
              <Button variant="ghost" size="small" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button size="small" onClick={() => navigate('/register')}>
                Sign Up
              </Button>
            </>
          )}

          <button
            className="mobile-menu-button"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <motion.div
          className="mobile-menu"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Link to="/" className="mobile-menu-item" onClick={() => setShowMobileMenu(false)}>
            <Home size={20} />
            Home
          </Link>
          <Link to="/trending" className="mobile-menu-item" onClick={() => setShowMobileMenu(false)}>
            <TrendingUp size={20} />
            Trending
          </Link>
          {isAuthenticated && (
            <>
              <Link
                to={`/u/${user?.username}`}
                className="mobile-menu-item"
                onClick={() => setShowMobileMenu(false)}
              >
                <User size={20} />
                Profile
              </Link>
              <button className="mobile-menu-item" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
