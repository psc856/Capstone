import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, MessageCircle, Share2, Award } from 'lucide-react';
import { toast } from 'react-toastify';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { postService } from '../services/postService';
import { commentService } from '../services/commentService';
import { useAuth } from '../contexts/AuthContext';
import './PostDetail.css';

const PostDetail = () => {
  const { postId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [postId]);

  const fetchPost = async () => {
    try {
      const data = await postService.getPost(postId);
      setPost(data.post);
    } catch (error) {
      toast.error('Post not found');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const data = await commentService.getPostComments(postId);
      setComments(data.comments || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await commentService.createComment(postId, {
        body: commentText,
        userId: user.userId,
        username: user.username,
      });
      setCommentText('');
      fetchComments();
      toast.success('Comment added!');
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="post-detail-page">
      <div className="post-detail-container">
        <Card className="post-detail-card">
          <div className="post-detail-header">
            <span className="post-community">c/{post.community}</span>
            <span className="post-author">Posted by u/{post.username}</span>
          </div>
          <h1 className="post-detail-title">{post.title}</h1>
          {post.body && <p className="post-detail-body">{post.body}</p>}
          {post.media && post.media.length > 0 && (
            <div className="post-detail-media">
              <img src={post.media[0]} alt="Post" />
            </div>
          )}
          <div className="post-detail-actions">
            <div className="vote-section">
              <button className="vote-btn"><ArrowUp size={20} /></button>
              <span>{post.score || 0}</span>
              <button className="vote-btn"><ArrowDown size={20} /></button>
            </div>
            <div className="action-btn">
              <MessageCircle size={18} />
              <span>{comments.length} Comments</span>
            </div>
            <button className="action-btn">
              <Share2 size={18} />
              <span>Share</span>
            </button>
          </div>
        </Card>

        <Card className="comments-section">
          <h2>Comments</h2>
          {user && (
            <form onSubmit={handleComment} className="comment-form">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="What are your thoughts?"
                rows={4}
              />
              <Button type="submit">Comment</Button>
            </form>
          )}
          <div className="comments-list">
            {comments.map((comment) => (
              <div key={comment.commentId} className="comment-item">
                <div className="comment-author">u/{comment.username}</div>
                <div className="comment-body">{comment.body}</div>
                <div className="comment-actions">
                  <button className="comment-vote"><ArrowUp size={16} /></button>
                  <span>{comment.score || 0}</span>
                  <button className="comment-vote"><ArrowDown size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PostDetail;
