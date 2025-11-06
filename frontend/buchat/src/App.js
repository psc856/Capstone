import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Communities from './pages/Communities';
import CreatePost from './pages/CreatePost';
import PostDetail from './pages/PostDetail';
import UserProfile from './pages/UserProfile';
import Leaderboard from './pages/Leaderboard';
import Search from './pages/Search';
import CommunityDetail from './pages/CommunityDetail';
import Messages from './pages/Messages';
import Notifications from './pages/Notifications';
import ComingSoon from './pages/ComingSoon';
import './App.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Navbar onMenuToggle={toggleSidebar} />
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            
            <main className={`app-main ${sidebarOpen ? 'sidebar-open' : ''}`}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/communities" element={<Communities />} />
                <Route path="/trending" element={<Home />} />
                <Route path="/create-post" element={<CreatePost />} />
                <Route path="/post/:postId" element={<PostDetail />} />
                <Route path="/u/:username" element={<UserProfile />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/search" element={<Search />} />
                <Route path="/c/:communityName" element={<CommunityDetail />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/discover" element={<ComingSoon feature="Discover" />} />
                <Route path="/polls" element={<ComingSoon feature="Polls" />} />
                <Route path="/capsules" element={<ComingSoon feature="Time Capsules" />} />
                <Route path="/events" element={<ComingSoon feature="Events" />} />
                <Route path="/settings" element={<ComingSoon feature="Settings" />} />
              </Routes>
            </main>

            <ToastContainer
              position="bottom-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
