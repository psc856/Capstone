import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Image, Video, Music, FileText, Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import Button from '../common/Button';
import Card from '../common/Card';
import { postService } from '../../services/postService';
import { presignService } from '../../services/presignService';
import { useAuth } from '../../contexts/AuthContext';
import './CreatePost.css';

const CreatePost = ({ communityName, onPostCreated }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [flair, setFlair] = useState('');
  const [nsfw, setNsfw] = useState(false);
  const [spoiler, setSpoiler] = useState(false);
  const [media, setMedia] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const fileInputRef = useRef(null);

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const getMediaType = (file) => {
    const type = file.type.split('/')[0];
    if (type === 'video') return 'video';
    if (type === 'audio') return 'audio';
    if (type === 'image') {
      if (file.type === 'image/gif') return 'gif';
      return 'image';
    }
    return 'document';
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);

    try {
      for (const file of files) {
        const mediaType = getMediaType(file);
        const fileId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Get presigned URL
        const { uploadUrl, fileUrl } = await presignService.getUploadUrl({
          filename: file.name,
          contentType: file.type,
          fileType: mediaType,
        });

        // Upload file with progress tracking
        const xhr = new XMLHttpRequest();
        
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const progress = (e.loaded / e.total) * 100;
            setUploadProgress(prev => ({ ...prev, [fileId]: progress }));
          }
        });

        await new Promise((resolve, reject) => {
          xhr.addEventListener('load', () => {
            if (xhr.status === 200) resolve();
            else reject(new Error('Upload failed'));
          });
          xhr.addEventListener('error', reject);
          xhr.open('PUT', uploadUrl);
          xhr.setRequestHeader('Content-Type', file.type);
          xhr.send(file);
        });

        // For videos, get HLS manifest
        let hlsManifest = null;
        let qualities = null;
        if (mediaType === 'video') {
          const videoId = fileUrl.split('/').pop().split('.')[0];
          hlsManifest = await presignService.getVideoManifest(videoId);
          qualities = ['144p', '240p', '360p', '480p', '720p', '1080p'];
        }

        // Get file dimensions for images/videos
        let dimensions = null;
        if (mediaType === 'image' || mediaType === 'video') {
          dimensions = await getMediaDimensions(file, mediaType);
        }

        // Get duration for videos/audio
        let duration = null;
        if (mediaType === 'video' || mediaType === 'audio') {
          duration = await getMediaDuration(file);
        }

        // Generate thumbnail for videos
        let thumbnail = fileUrl;
        if (mediaType === 'video') {
          thumbnail = await generateVideoThumbnail(file);
        }

        // Add to media array
        setMedia(prev => [...prev, {
          id: fileId,
          type: mediaType,
          url: fileUrl,
          thumbnail,
          caption: '',
          metadata: {
            filename: file.name,
            size: file.size,
            mimeType: file.type,
            duration,
            dimensions,
            qualities,
            hlsManifest,
          }
        }]);

        setUploadProgress(prev => {
          const updated = { ...prev };
          delete updated[fileId];
          return updated;
        });
      }

      toast.success('Media uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload media');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const getMediaDimensions = (file, type) => {
    return new Promise((resolve) => {
      if (type === 'image') {
        const img = new Image();
        img.onload = () => resolve({ width: img.width, height: img.height });
        img.src = URL.createObjectURL(file);
      } else if (type === 'video') {
        const video = document.createElement('video');
        video.onloadedmetadata = () => {
          resolve({ width: video.videoWidth, height: video.videoHeight });
          URL.revokeObjectURL(video.src);
        };
        video.src = URL.createObjectURL(file);
      } else {
        resolve(null);
      }
    });
  };

  const getMediaDuration = (file) => {
    return new Promise((resolve) => {
      const element = file.type.startsWith('video/') 
        ? document.createElement('video')
        : document.createElement('audio');
      
      element.onloadedmetadata = () => {
        resolve(Math.round(element.duration));
        URL.revokeObjectURL(element.src);
      };
      element.src = URL.createObjectURL(file);
    });
  };

  const generateVideoThumbnail = (file) => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      video.onloadeddata = () => {
        video.currentTime = 1; // Get frame at 1 second
      };

      video.onseeked = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
        URL.revokeObjectURL(video.src);
      };

      video.src = URL.createObjectURL(file);
    });
  };

  const handleRemoveMedia = (mediaId) => {
    setMedia(media.filter(m => m.id !== mediaId));
  };

  const handleUpdateCaption = (mediaId, caption) => {
    setMedia(media.map(m => m.id === mediaId ? { ...m, caption } : m));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (!user) {
      toast.error('Please login to create posts');
      return;
    }

    try {
      const postData = {
        userId: user.userId,
        title: title.trim(),
        body: body.trim(),
        tags,
        flair: flair || null,
        nsfw,
        spoiler,
        media: media.map(m => ({
          type: m.type,
          url: m.url,
          thumbnail: m.thumbnail,
          caption: m.caption,
          metadata: m.metadata
        }))
      };

      await postService.createPost(communityName, postData);
      
      toast.success('Post created successfully!');
      
      // Reset form
      setTitle('');
      setBody('');
      setTags([]);
      setFlair('');
      setNsfw(false);
      setSpoiler(false);
      setMedia([]);

      if (onPostCreated) onPostCreated();
    } catch (error) {
      console.error('Create post error:', error);
      toast.error('Failed to create post');
    }
  };

  return (
    <Card className="create-post">
      <h2>Create Post in c/{communityName}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={300}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <textarea
            placeholder="Text (optional)"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={6}
            className="form-textarea"
          />
        </div>

        {/* Media Upload */}
        <div className="form-group">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          
          <Button
            type="button"
            variant="secondary"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <Upload size={18} />
            {uploading ? 'Uploading...' : 'Add Media'}
          </Button>
        </div>

        {/* Media Preview */}
        {media.length > 0 && (
          <div className="media-preview-grid">
            {media.map((item) => (
              <div key={item.id} className="media-preview-item">
                <button
                  type="button"
                  className="remove-media-btn"
                  onClick={() => handleRemoveMedia(item.id)}
                >
                  <X size={16} />
                </button>
                
                <div className="media-preview-thumbnail">
                  {item.type === 'video' && <Video size={24} className="media-icon" />}
                  {item.type === 'audio' && <Music size={24} className="media-icon" />}
                  {item.type === 'document' && <FileText size={24} className="media-icon" />}
                  {(item.type === 'image' || item.type === 'gif') && (
                    <img src={item.thumbnail} alt="Preview" />
                  )}
                  {item.type === 'video' && (
                    <img src={item.thumbnail} alt="Video preview" />
                  )}
                </div>

                <input
                  type="text"
                  placeholder="Add caption (optional)"
                  value={item.caption}
                  onChange={(e) => handleUpdateCaption(item.id, e.target.value)}
                  className="caption-input"
                />
                
                <div className="media-info">
                  <span className="media-type">{item.type}</span>
                  <span className="media-size">
                    {(item.metadata.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload Progress */}
        {Object.keys(uploadProgress).length > 0 && (
          <div className="upload-progress">
            {Object.entries(uploadProgress).map(([id, progress]) => (
              <div key={id} className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progress}%` }}
                />
                <span className="progress-text">{Math.round(progress)}%</span>
              </div>
            ))}
          </div>
        )}

        {/* Tags */}
        <div className="form-group">
          <input
            type="text"
            placeholder="Add tags (press Enter)"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={handleAddTag}
            className="form-input"
          />
          {tags.length > 0 && (
            <div className="tags-list">
              {tags.map((tag) => (
                <span key={tag} className="tag">
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="remove-tag-btn"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Flair */}
        <div className="form-group">
          <input
            type="text"
            placeholder="Flair (optional)"
            value={flair}
            onChange={(e) => setFlair(e.target.value)}
            className="form-input"
          />
        </div>

        {/* Toggles */}
        <div className="form-toggles">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={nsfw}
              onChange={(e) => setNsfw(e.target.checked)}
            />
            <span>NSFW</span>
          </label>
          
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={spoiler}
              onChange={(e) => setSpoiler(e.target.checked)}
            />
            <span>Spoiler</span>
          </label>
        </div>

        <Button type="submit" disabled={uploading || !title.trim()}>
          Create Post
        </Button>
      </form>
    </Card>
  );
};

export default CreatePost;
