import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postAPI } from '../api/postAPI';

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [commentInputs, setCommentInputs] = useState({});
  const [user, setUser] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportPostId, setReportPostId] = useState(null);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await postAPI.getPosts();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    setIsPosting(true);
    try {
      const data = await postAPI.createPost(newPost);
      if (data.post) {
        setPosts([data.post, ...posts]);
        setNewPost('');
        
        // Update user data with new points
        if (data.user) {
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
        }
      }
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsPosting(false);
    }
  };

  const handleAddComment = async (postId) => {
    const content = commentInputs[postId];
    if (!content || !content.trim()) return;

    try {
      const data = await postAPI.addComment(postId, content);
      if (data.post) {
        setPosts(posts.map(p => p._id === postId ? data.post : p));
        setCommentInputs({ ...commentInputs, [postId]: '' });
        
        // Update user data with new points
        if (data.user) {
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
        }
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleReaction = async (postId, type) => {
    try {
      const data = await postAPI.toggleReaction(postId, type);
      if (data.post) {
        setPosts(posts.map(p => p._id === postId ? data.post : p));
        
        // Update user data with new points
        if (data.user) {
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
        }
      }
    } catch (error) {
      console.error('Error toggling reaction:', error);
    }
  };

  const getReactionCount = (post, type) => {
    return post.reactions?.filter(r => r.type === type).length || 0;
  };

  const hasUserReacted = (post, type) => {
    if (!user) return false;
    return post.reactions?.some(r => r.user === user._id && r.type === type) || false;
  };

  const reactionIcons = {
    heart: '❤️',
    support: '🤝',
    hug: '🤗',
    star: '⭐',
  };

  const handleOpenReportModal = (postId) => {
    setReportPostId(postId);
    setShowReportModal(true);
  };

  const handleCloseReportModal = () => {
    setShowReportModal(false);
    setReportPostId(null);
    setReportReason('');
    setReportDescription('');
  };

  const handleSubmitReport = async () => {
    if (!reportReason) {
      alert('Please select a reason for reporting');
      return;
    }

    try {
      await postAPI.reportPost(reportPostId, reportReason, reportDescription);
      alert('Post reported successfully. Our team will review it.');
      handleCloseReportModal();
    } catch (error) {
      console.error('Error reporting post:', error);
      alert('Failed to report post');
    }
  };

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
              {user && (
                <div className="px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-full">
                  <span className="text-yellow-400 font-bold">⭐ {user.points || 0} Points</span>
                </div>
              )}
              <Link to="/community" className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
                Community
              </Link>
              <Link to="/profile" className="text-white hover:text-purple-300 transition-colors font-medium">
                Profile
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-300 text-sm font-medium mb-4">
            🌟 Anonymous Support Community
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Community Wall
          </h1>
          <p className="text-xl text-gray-400">
            Share your thoughts anonymously and connect with others in a supportive space
          </p>
        </div>

        {/* Create Post */}
        {user && (
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-slate-700/50 mb-8">
            <form onSubmit={handleCreatePost}>
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Share your thoughts anonymously..."
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none"
                rows="4"
              />
              <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-gray-400">
                  Posting as: <span className="text-purple-400 font-medium">{user.anonymousName || 'Anonymous'}</span>
                </p>
                <button
                  type="submit"
                  disabled={isPosting || !newPost.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPosting ? 'Posting...' : 'Post'}
                </button>
              </div>
            </form>
          </div>
        )}

        {!user && (
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-slate-700/50 mb-8 text-center">
            <p className="text-gray-400 mb-4">Please sign in to post and interact with the community</p>
            <Link
              to="/login"
              className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              Sign In
            </Link>
          </div>
        )}

        {/* Posts */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-3xl p-12 text-center border border-slate-700/30">
            <p className="text-gray-400 text-lg">No posts yet. Be the first to share!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post._id} className="bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-slate-700/50">
                {/* Post Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">
                        {post.anonymousName ? post.anonymousName.charAt(0).toUpperCase() : 'A'}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-white font-medium">{post.anonymousName || 'Anonymous'}</p>
                        {post.user?.points !== undefined && (
                          <span className="px-2 py-0.5 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-xs text-yellow-400 font-medium">
                            ⭐ {post.user.points}
                          </span>
                        )}
                        {post.user?.badges && post.user.badges.length > 0 && (
                          <div className="flex gap-1">
                            {post.user.badges.slice(0, 3).map((badge, idx) => (
                              <span key={idx} className="text-lg" title={badge.name}>
                                {badge.icon}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                  {user && (
                    <button
                      onClick={() => handleOpenReportModal(post._id)}
                      className="text-gray-500 hover:text-red-400 transition-colors"
                      title="Report post"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Post Content */}
                <p className="text-gray-300 mb-4 whitespace-pre-wrap">{post.content}</p>

                {/* Reactions */}
                <div className="flex gap-3 mb-4 pb-4 border-b border-slate-700">
                  {Object.entries(reactionIcons).map(([type, icon]) => (
                    <button
                      key={type}
                      onClick={() => user && handleReaction(post._id, type)}
                      disabled={!user}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                        hasUserReacted(post, type)
                          ? 'bg-purple-500/20 border border-purple-500/50'
                          : 'bg-slate-700/30 border border-slate-600 hover:bg-slate-700/50'
                      } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <span>{icon}</span>
                      <span className="text-white text-sm">{getReactionCount(post, type)}</span>
                    </button>
                  ))}
                </div>

                {/* Comments */}
                {post.comments && post.comments.length > 0 && (
                  <div className="space-y-3 mb-4">
                    {post.comments.map((comment) => (
                      <div key={comment._id} className="bg-slate-900/30 rounded-xl p-3">
                        <div className="flex items-start gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-sm font-bold">
                              {comment.anonymousName ? comment.anonymousName.charAt(0).toUpperCase() : 'A'}
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-purple-400 font-medium">{comment.anonymousName || 'Anonymous'}</p>
                            <p className="text-gray-300 text-sm">{comment.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Comment */}
                {user && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={commentInputs[post._id] || ''}
                      onChange={(e) => setCommentInputs({ ...commentInputs, [post._id]: e.target.value })}
                      placeholder="Add a supportive comment..."
                      className="flex-1 px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post._id)}
                    />
                    <button
                      onClick={() => handleAddComment(post._id)}
                      className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all text-sm"
                    >
                      Comment
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-3xl shadow-2xl p-8 max-w-md w-full border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-4">Report Post</h2>
            <p className="text-gray-400 mb-6">Help us keep the community safe by reporting inappropriate content.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Reason *</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-purple-500 outline-none"
                  required
                >
                  <option value="">Select a reason</option>
                  <option value="spam">Spam</option>
                  <option value="harassment">Harassment or bullying</option>
                  <option value="inappropriate">Inappropriate content</option>
                  <option value="misinformation">Misinformation</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Additional details (optional)</label>
                <textarea
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  placeholder="Provide more context about why you're reporting this post..."
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                  rows="3"
                  maxLength={500}
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={handleSubmitReport}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all"
              >
                Submit Report
              </button>
              <button
                onClick={handleCloseReportModal}
                className="px-6 py-3 bg-slate-700 text-white rounded-xl font-semibold hover:bg-slate-600 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;

