import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userAPI, postAPI } from '../api/postAPI';

const UserProfile = () => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [myPosts, setMyPosts] = useState([]);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newAnonymousName, setNewAnonymousName] = useState('');
  const [editingPostId, setEditingPostId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setNewAnonymousName(user.anonymousName || '');
      fetchMyPosts();
    }
  }, [user]);

  const fetchMyPosts = async () => {
    try {
      const data = await postAPI.getMyPosts();
      setMyPosts(data.posts || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleUpdateAnonymousName = async () => {
    if (!newAnonymousName.trim()) return;

    try {
      const data = await userAPI.updateAnonymousName(newAnonymousName);
      if (data.user) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        setIsEditingName(false);
        alert('Anonymous name updated successfully!');
      }
    } catch (error) {
      console.error('Error updating anonymous name:', error);
      alert('Failed to update anonymous name');
    }
  };

  const handleEditPost = (post) => {
    setEditingPostId(post._id);
    setEditContent(post.content);
  };

  const handleUpdatePost = async (postId) => {
    if (!editContent.trim()) return;

    try {
      const data = await postAPI.updatePost(postId, editContent);
      if (data.post) {
        setMyPosts(myPosts.map(p => p._id === postId ? data.post : p));
        setEditingPostId(null);
        setEditContent('');
        alert('Post updated successfully!');
      }
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post');
    }
  };

  const handleDeletePost = async (postId) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await postAPI.deletePost(postId);
      setMyPosts(myPosts.filter(p => p._id !== postId));
      alert('Post deleted successfully!');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 bg-slate-900/95 backdrop-blur-lg shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              YouMatter
            </Link>
            <div className="flex gap-4 items-center">
              <Link to="/community" className="text-white hover:text-purple-300 transition-colors font-medium">
                Community
              </Link>
              <Link to="/profile" className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
                Profile
              </Link>
              {(user.role === 'admin' || user.role === 'staff') && (
                <Link to="/admin" className="text-yellow-400 hover:text-yellow-300 transition-colors font-medium">
                  {user.role === 'admin' ? '👑 Admin' : '⭐ Staff'}
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-red-500/50 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Profile Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-300 text-sm font-medium mb-4">
            👋 Welcome Back
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Your Profile
          </h1>
          <p className="text-xl text-gray-400">
            Manage your account and track your wellness journey
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-slate-700/50 mb-8">
          <div className="flex items-center gap-6 mb-8">
            {/* Avatar */}
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/50">
              <span className="text-4xl font-bold text-white">
                {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
              </span>
            </div>
            
            {/* User Info */}
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white mb-2">
                {user.email || 'User'}
              </h2>
              <p className="text-gray-400">
                Member since {new Date(user.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>

            {/* Points Display */}
            <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-2xl p-6 text-center">
              <div className="text-4xl mb-2">⭐</div>
              <div className="text-3xl font-bold text-yellow-400 mb-1">
                {user.points || 0}
              </div>
              <div className="text-sm text-gray-300">Total Points</div>
            </div>
          </div>

          {/* Account Details */}
          <div className="border-t border-slate-700 pt-8">
            <h3 className="text-xl font-bold text-white mb-6">Account Information</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-slate-900/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="text-white font-medium">{user.email}</p>
                  </div>
                </div>
              </div>

              {/* Anonymous Name */}
              <div className="p-4 bg-slate-900/50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-pink-500/10 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Anonymous Name</p>
                      {!isEditingName ? (
                        <p className="text-white font-medium">{user.anonymousName || 'Not set'}</p>
                      ) : (
                        <input
                          type="text"
                          value={newAnonymousName}
                          onChange={(e) => setNewAnonymousName(e.target.value)}
                          className="px-3 py-1 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                          maxLength={50}
                        />
                      )}
                    </div>
                  </div>
                  {!isEditingName ? (
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="px-4 py-2 bg-purple-500/10 text-purple-400 rounded-lg hover:bg-purple-500/20 transition-all text-sm font-medium"
                    >
                      Edit
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleUpdateAnonymousName}
                        className="px-4 py-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-all text-sm font-medium"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingName(false);
                          setNewAnonymousName(user.anonymousName || '');
                        }}
                        className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all text-sm font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">This is how you appear in the community</p>
              </div>

              <div className="flex justify-between items-center p-4 bg-slate-900/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Account Status</p>
                    <p className="text-white font-medium">
                      {user.isActive ? (
                        <span className="text-green-400">Active</span>
                      ) : (
                        <span className="text-red-400">Inactive</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Badges Section */}
          <div className="border-t border-slate-700 pt-8 mt-8">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span>🏆</span>
              <span>Achievements & Badges</span>
            </h3>
            
            {user.badges && user.badges.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.badges.map((badge, index) => (
                  <div key={index} className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-4 hover:scale-105 transition-transform">
                    <div className="flex items-center gap-4">
                      <div className="text-5xl">{badge.icon}</div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-white mb-1">{badge.name}</h4>
                        <p className="text-sm text-gray-400">{badge.description}</p>
                        <p className="text-xs text-purple-400 mt-2">
                          Earned {new Date(badge.earnedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-slate-900/30 rounded-xl border border-slate-700/50">
                <div className="text-5xl mb-3">🎯</div>
                <p className="text-gray-400 mb-2">No badges yet!</p>
                <p className="text-sm text-gray-500">Start your wellness journey to earn achievements</p>
              </div>
            )}
          </div>
        </div>

        {/* My Posts Section */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-slate-700/50 mb-8">
          <h3 className="text-2xl font-bold text-white mb-6">My Posts</h3>
          
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
              <p className="mt-4 text-gray-400">Loading your posts...</p>
            </div>
          ) : myPosts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">You haven't posted anything yet</p>
              <Link
                to="/community"
                className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                Visit Community
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {myPosts.map((post) => (
                <div key={post._id} className="bg-slate-900/30 rounded-xl p-4 border border-slate-700">
                  {editingPostId === post._id ? (
                    <div>
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                        rows="4"
                      />
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleUpdatePost(post._id)}
                          className="px-4 py-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-all text-sm font-medium"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingPostId(null);
                            setEditContent('');
                          }}
                          className="px-4 py-2 bg-gray-500/10 text-gray-400 rounded-lg hover:bg-gray-500/20 transition-all text-sm font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-purple-400 font-medium text-sm">{post.anonymousName}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(post.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditPost(post)}
                            className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                            title="Edit"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeletePost(post._id)}
                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-300 whitespace-pre-wrap">{post.content}</p>
                      <div className="flex gap-4 mt-3 text-sm text-gray-500">
                        <span>💬 {post.comments?.length || 0} comments</span>
                        <span>❤️ {post.reactions?.length || 0} reactions</span>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Link to="/mood" className="group bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-6 hover:border-pink-500/50 transition-all hover:scale-105 cursor-pointer">
            <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Mood Tracker</h3>
            <p className="text-sm text-gray-400">Track your daily moods</p>
          </Link>

          <Link to="/journal" className="group bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-6 hover:border-indigo-500/50 transition-all hover:scale-105 cursor-pointer">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">My Journal</h3>
            <p className="text-sm text-gray-400">Write your thoughts</p>
          </Link>

          <Link to="/community" className="group bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-6 hover:border-purple-500/50 transition-all hover:scale-105 cursor-pointer">
            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Community</h3>
            <p className="text-sm text-gray-400">Connect with others</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
