import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Calendar, Award, TrendingUp } from 'lucide-react';
import { toast } from 'react-toastify';
import Card from '../components/common/Card';
import PostCard from '../components/posts/PostCard';
import Button from '../components/common/Button';
import { userService } from '../services/userService';
import { socialService } from '../services/socialService';
import { useAuth } from '../contexts/AuthContext';
import './UserProfile.css';

const UserProfile = () => {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchPosts();
    fetchStats();
  }, [username]);

  const fetchProfile = async () => {
    try {
      const data = await userService.getUserProfile(username);
      setProfile(data.user);
    } catch (error) {
      toast.error('User not found');
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      const data = await userService.getUserPosts(username);
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await userService.getUserStats(username);
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleFollow = async () => {
    if (!currentUser) return;
    try {
      if (isFollowing) {
        await socialService.unfollowUser(username, currentUser.userId);
        setIsFollowing(false);
        toast.success('Unfollowed');
      } else {
        await socialService.followUser(username, currentUser.userId);
        setIsFollowing(true);
        toast.success('Following');
      }
    } catch (error) {
      toast.error('Action failed');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="profile-page">
      <div className="profile-container">
        <Card className="profile-header">
          <div className="profile-banner"></div>
          <div className="profile-info">
            <div className="profile-avatar">
              <User size={48} />
            </div>
            <div className="profile-details">
              <h1>u/{profile.username}</h1>
              {profile.displayName && <p className="display-name">{profile.displayName}</p>}
              {profile.bio && <p className="bio">{profile.bio}</p>}
              <div className="profile-meta">
                <span><Calendar size={14} /> Joined {new Date(profile.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            {currentUser && currentUser.username !== username && (
              <Button onClick={handleFollow} variant={isFollowing ? 'ghost' : 'primary'}>
                {isFollowing ? 'Unfollow' : 'Follow'}
              </Button>
            )}
          </div>
        </Card>

        <div className="profile-content">
          <aside className="profile-sidebar">
            <Card>
              <h3>Stats</h3>
              <div className="stats-list">
                <div className="stat-item">
                  <TrendingUp size={18} />
                  <span>{stats?.karma || 0} Karma</span>
                </div>
                <div className="stat-item">
                  <Award size={18} />
                  <span>Level {stats?.level || 1}</span>
                </div>
              </div>
            </Card>
          </aside>

          <main className="profile-main">
            <h2>Posts</h2>
            {posts.length > 0 ? (
              <div className="posts-list">
                {posts.map((post) => (
                  <PostCard key={post.postId} post={post} />
                ))}
              </div>
            ) : (
              <Card>
                <p className="empty-message">No posts yet</p>
              </Card>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
