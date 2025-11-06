import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, User, Search } from 'lucide-react';
import { toast } from 'react-toastify';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { socialService } from '../services/socialService';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Messages.css';

const Messages = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchConversations();
  }, [isAuthenticated, navigate]);

  const fetchConversations = async () => {
    try {
      const data = await socialService.getInbox(user.userId);
      setConversations(data.conversations || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const data = await socialService.getConversation(conversationId);
      setMessages(data.messages || []);
      setActiveConversation(conversationId);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !activeConversation) return;

    try {
      await socialService.sendMessage({
        conversationId: activeConversation,
        senderId: user.userId,
        body: messageText,
      });
      setMessageText('');
      fetchMessages(activeConversation);
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="messages-page">
      <div className="messages-container">
        <Card className="messages-card">
          <div className="messages-layout">
            <aside className="conversations-sidebar">
              <div className="sidebar-header">
                <h2>Messages</h2>
                <div className="search-box">
                  <Search size={16} />
                  <input type="text" placeholder="Search messages" />
                </div>
              </div>
              <div className="conversations-list">
                {conversations.length > 0 ? (
                  conversations.map((conv) => (
                    <button
                      key={conv.conversationId}
                      className={`conversation-item ${activeConversation === conv.conversationId ? 'active' : ''}`}
                      onClick={() => fetchMessages(conv.conversationId)}
                    >
                      <div className="conv-avatar">
                        <User size={20} />
                      </div>
                      <div className="conv-info">
                        <div className="conv-name">u/{conv.otherUser}</div>
                        <div className="conv-preview">{conv.lastMessage}</div>
                      </div>
                      {conv.unread > 0 && (
                        <span className="unread-badge">{conv.unread}</span>
                      )}
                    </button>
                  ))
                ) : (
                  <div className="empty-state">
                    <p>No messages yet</p>
                  </div>
                )}
              </div>
            </aside>

            <main className="messages-main">
              {activeConversation ? (
                <>
                  <div className="messages-header">
                    <div className="header-user">
                      <div className="user-avatar">
                        <User size={20} />
                      </div>
                      <span>u/{conversations.find(c => c.conversationId === activeConversation)?.otherUser}</span>
                    </div>
                  </div>

                  <div className="messages-content">
                    {messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`message ${msg.senderId === user.userId ? 'sent' : 'received'}`}
                      >
                        <div className="message-bubble">
                          <p>{msg.body}</p>
                          <span className="message-time">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendMessage} className="message-input">
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Type a message..."
                    />
                    <Button type="submit" icon={<Send size={18} />}>
                      Send
                    </Button>
                  </form>
                </>
              ) : (
                <div className="no-conversation">
                  <p>Select a conversation to start messaging</p>
                </div>
              )}
            </main>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Messages;
