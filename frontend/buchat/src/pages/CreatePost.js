import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Image, Link as LinkIcon, FileText } from 'lucide-react';
import { toast } from 'react-toastify';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { postService } from '../services/postService';
import { communityService } from '../services/communityService';
import { useAuth } from '../contexts/AuthContext';
import './CreatePost.css';

const CreatePost = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [communities, setCommunities] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    community: '',
    tags: '',
    type: 'text',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchCommunities();
  }, [isAuthenticated, navigate]);

  const fetchCommunities = async () => {
    try {
      const response = await communityService.getAllCommunities({ limit: 100 });
      setCommunities(response.communities || []);
    } catch (error) {
      console.error('Error fetching communities:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.community) {
      toast.error('Please select a community');
      return;
    }

    setLoading(true);
    try {
      const postData = {
        title: formData.title,
        body: formData.body,
        userId: user.userId,
        username: user.username,
        type: formData.type,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      };

      await postService.createPost(formData.community, postData);
      toast.success('Post created successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-page">
      <div className="create-post-container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <h1>Create Post</h1>
            <form onSubmit={handleSubmit} className="create-post-form">
              <div className="form-group">
                <label>Community *</label>
                <select
                  value={formData.community}
                  onChange={(e) => setFormData({ ...formData, community: e.target.value })}
                  required
                >
                  <option value="">Select a community</option>
                  {communities.map((c) => (
                    <option key={c.communityId} value={c.name}>
                      c/{c.name}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter post title"
                required
              />

              <div className="form-group">
                <label>Content</label>
                <textarea
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  placeholder="What's on your mind?"
                  rows={8}
                />
              </div>

              <Input
                label="Tags (comma separated)"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="tech, discussion, question"
              />

              <div className="form-actions">
                <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
                <Button type="submit" loading={loading} disabled={loading}>
                  Post
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default CreatePost;
