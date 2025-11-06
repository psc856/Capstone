import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, TrendingUp, Plus } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { communityService } from '../services/communityService';
import { useAuth } from '../contexts/AuthContext';
import './Communities.css';

const Communities = () => {
  const { isAuthenticated } = useAuth();
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      setLoading(true);
      const response = await communityService.getAllCommunities({ limit: 50 });
      setCommunities(response.communities || []);
    } catch (error) {
      console.error('Error fetching communities:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="communities-page">
      <div className="communities-container">
        <div className="page-header">
          <div>
            <h1 className="text-gradient">Communities</h1>
            <p className="page-description">
              Discover and join amazing communities
            </p>
          </div>
          {isAuthenticated && (
            <Button icon={<Plus size={20} />}>
              Create Community
            </Button>
          )}
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        ) : communities.length > 0 ? (
          <motion.div
            className="communities-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {communities.map((community, index) => (
              <motion.div
                key={community.communityId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link to={`/c/${community.name}`} className="community-card-link">
                  <Card className="community-card" hover>
                    <div className="community-icon">
                      <Users size={28} />
                    </div>
                    <h3 className="community-title">c/{community.name}</h3>
                    <p className="community-description">
                      {community.description || 'No description yet'}
                    </p>
                    <div className="community-stats">
                      <div className="stat">
                        <Users size={16} />
                        <span>{community.memberCount || 0} members</span>
                      </div>
                      <div className="stat">
                        <TrendingUp size={16} />
                        <span>{community.postCount || 0} posts</span>
                      </div>
                    </div>
                    {community.category && (
                      <span className="community-category">{community.category}</span>
                    )}
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <Card>
            <div className="empty-state">
              <Users size={48} />
              <h3>No communities yet</h3>
              <p>Be the first to create a community!</p>
              {isAuthenticated && (
                <Button icon={<Plus size={20} />}>
                  Create Community
                </Button>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Communities;
