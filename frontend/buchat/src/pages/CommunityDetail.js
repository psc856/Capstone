import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, TrendingUp, Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import PostCard from '../components/posts/PostCard';
import { communityService } from '../services/communityService';
import { postService } from '../services/postService';
import { useAuth } from '../contexts/AuthContext';
import './CommunityDetail.css';

const CommunityDetail = () => {
  const { communityName } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    fetchCommunity();
    fetchPosts();
  }, [communityName]);

  const fetchCommunity = async () => {
    try {
      const data = await communityService.getCommunity(communityName);
      setCommunity(data.community);
    } catch (error) {
      toast.error('Community not found');
      navigate('/communities');
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      const data = await postService.getCommunityPosts(communityName);
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleJoin = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      if (isMember) {
        await communityService.leaveCommunity(communityName, user.userId);
        setIsMember(false);
        toast.success('Left community');
      } else {
        await communityService.joinCommunity(communityName, user.userId);
        setIsMember(true);
        toast.success('Joined community!');
      }
      fetchCommunity();
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

  if (!community) return null;

  return (
    <div className="community-detail-page">
      <div className="community-detail-container">
        <Card className="community-header">
          <div className="community-banner"></div>
          <div className="community-info">
            <div className="community-icon">
              <Users size={32} />
            </div>
            <div className="community-details">
              <h1>c/{community.name}</h1>
              <p>{community.description}</p>
              <div className="community-stats">
                <span><Users size={14} /> {community.memberCount || 0} members</span>
                <span><TrendingUp size={14} /> {posts.length} posts</span>
              </div>
            </div>
            <Button onClick={handleJoin} variant={isMember ? 'ghost' : 'primary'}>
              {isMember ? 'Leave' : 'Join'}
            </Button>
          </div>
        </Card>

        <div className="community-content">
          <main className="community-main">
            <div className="posts-header">
              <h2>Posts</h2>
              {isAuthenticated && isMember && (
                <Button
                  size="small"
                  icon={<Plus size={18} />}
                  onClick={() => navigate('/create-post')}
                >
                  Create Post
                </Button>
              )}
            </div>
            {posts.length > 0 ? (
              <div className="posts-list">
                {posts.map((post) => (
                  <PostCard key={post.postId} post={post} onVote={fetchPosts} />
                ))}
              </div>
            ) : (
              <Card>
                <p className="empty-message">No posts yet. Be the first to post!</p>
              </Card>
            )}
          </main>

          <aside className="community-sidebar">
            <Card>
              <h3>About Community</h3>
              <p>{community.description || 'No description available'}</p>
              {community.rules && (
                <>
                  <h4>Rules</h4>
                  <ul className="rules-list">
                    {community.rules.map((rule, index) => (
                      <li key={index}>{rule}</li>
                    ))}
                  </ul>
                </>
              )}
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CommunityDetail;
