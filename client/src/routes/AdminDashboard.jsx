import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminAPI } from '../api/adminAPI';
import announcementAPI from '../api/announcementAPI';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [reportedPosts, setReportedPosts] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    type: 'announcement',
    expiresAt: '',
  });
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Check if user is admin or staff
  useEffect(() => {
    if (!user.role || (user.role !== 'admin' && user.role !== 'staff')) {
      alert('Access denied. Admin or Staff only.');
      navigate('/profile');
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchDashboardData();
  }, [activeTab, searchTerm, roleFilter]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'dashboard') {
        const data = await adminAPI.getDashboardStats();
        setStats(data);
      } else if (activeTab === 'users') {
        const params = {};
        if (searchTerm) params.search = searchTerm;
        if (roleFilter) params.role = roleFilter;
        const data = await adminAPI.getAllUsers(params);
        setUsers(data.users || []);
      } else if (activeTab === 'posts') {
        const data = await adminAPI.getAllPosts();
        setPosts(data.posts || []);
      } else if (activeTab === 'reports') {
        const data = await adminAPI.getReportedPosts('pending');
        setReportedPosts(data.posts || []);
      } else if (activeTab === 'announcements') {
        const data = await announcementAPI.getAllAnnouncements();
        setAnnouncements(data.announcements || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    if (!confirm(`Change user role to ${newRole}?`)) return;
    
    try {
      await adminAPI.updateUserRole(userId, newRole);
      alert('Role updated successfully!');
      fetchDashboardData();
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Failed to update role');
    }
  };

  const handleToggleStatus = async (userId) => {
    if (!confirm('Toggle user status?')) return;
    
    try {
      await adminAPI.toggleUserStatus(userId);
      alert('User status updated!');
      fetchDashboardData();
    } catch (error) {
      console.error('Error toggling status:', error);
      alert('Failed to update status');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure? This will delete the user and all their data.')) return;
    
    try {
      await adminAPI.deleteUser(userId);
      alert('User deleted successfully!');
      fetchDashboardData();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  const handleDeletePost = async (postId) => {
    if (!confirm('Delete this post?')) return;
    
    try {
      await adminAPI.deletePost(postId);
      alert('Post deleted successfully!');
      fetchDashboardData();
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  };

  const handleToggleModeration = async (postId) => {
    try {
      await adminAPI.togglePostModeration(postId);
      alert('Post moderation status updated!');
      fetchDashboardData();
    } catch (error) {
      console.error('Error toggling moderation:', error);
      alert('Failed to update moderation status');
    }
  };

  const handleUpdateReportStatus = async (postId, reportId, status) => {
    try {
      await adminAPI.updateReportStatus(postId, reportId, status);
      alert('Report status updated!');
      fetchDashboardData();
    } catch (error) {
      console.error('Error updating report status:', error);
      alert('Failed to update report status');
    }
  };

  const handleCreateAnnouncement = async () => {
    if (!newAnnouncement.title || !newAnnouncement.content) {
      alert('Title and content are required');
      return;
    }

    try {
      await announcementAPI.createAnnouncement(
        newAnnouncement.title,
        newAnnouncement.content,
        newAnnouncement.type,
        newAnnouncement.expiresAt || null
      );
      alert('Announcement created successfully!');
      setShowAnnouncementModal(false);
      setNewAnnouncement({ title: '', content: '', type: 'announcement', expiresAt: '' });
      fetchDashboardData();
    } catch (error) {
      console.error('Error creating announcement:', error);
      alert('Failed to create announcement');
    }
  };

  const handleDeleteAnnouncement = async (announcementId) => {
    if (!confirm('Delete this announcement?')) return;

    try {
      await announcementAPI.deleteAnnouncement(announcementId);
      alert('Announcement deleted successfully!');
      fetchDashboardData();
    } catch (error) {
      console.error('Error deleting announcement:', error);
      alert('Failed to delete announcement');
    }
  };

  const handleToggleAnnouncementStatus = async (announcementId) => {
    try {
      await announcementAPI.toggleAnnouncementStatus(announcementId);
      alert('Announcement status updated!');
      fetchDashboardData();
    } catch (error) {
      console.error('Error toggling announcement status:', error);
      alert('Failed to update announcement status');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="relative z-50 bg-slate-900/95 backdrop-blur-lg shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              YouMatter Admin
            </Link>
            <div className="flex gap-4 items-center">
              <span className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium">
                {user.role === 'admin' ? '👑 Admin' : '⭐ Staff'}
              </span>
              <Link to="/profile" className="text-white hover:text-purple-300 transition-colors font-medium">
                Back to Profile
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-xl text-gray-400">Manage users, posts, and platform content</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'dashboard'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'bg-slate-800/50 text-gray-400 hover:text-white'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'users'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'bg-slate-800/50 text-gray-400 hover:text-white'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('posts')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'posts'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'bg-slate-800/50 text-gray-400 hover:text-white'
            }`}
          >
            Posts
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'reports'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'bg-slate-800/50 text-gray-400 hover:text-white'
            }`}
          >
            Reports
            {reportedPosts.length > 0 && (
              <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                {reportedPosts.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'announcements'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'bg-slate-800/50 text-gray-400 hover:text-white'
            }`}
          >
            📢 Announcements
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : (
          <>
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && stats && (
              <div>
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                    <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                      {stats.stats.totalUsers}
                    </div>
                    <div className="text-gray-400">Total Users</div>
                  </div>
                  <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                    <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                      {stats.stats.totalPosts}
                    </div>
                    <div className="text-gray-400">Total Posts</div>
                  </div>
                  <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                    <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                      {stats.stats.totalMoods}
                    </div>
                    <div className="text-gray-400">Mood Entries</div>
                  </div>
                  <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                    <div className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-2">
                      {stats.stats.totalJournals}
                    </div>
                    <div className="text-gray-400">Journal Entries</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Recent Users */}
                  <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-slate-700/50">
                    <h2 className="text-2xl font-bold text-white mb-4">Recent Users</h2>
                    <div className="space-y-3">
                      {stats.recentUsers?.map((u) => (
                        <div key={u._id} className="bg-slate-900/30 rounded-xl p-3 flex justify-between items-center">
                          <div>
                            <div className="text-white font-medium">{u.email}</div>
                            <div className="text-sm text-gray-500">
                              {new Date(u.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            u.role === 'admin' ? 'bg-purple-500/20 text-purple-300' :
                            u.role === 'staff' ? 'bg-blue-500/20 text-blue-300' :
                            'bg-gray-500/20 text-gray-300'
                          }`}>
                            {u.role}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Posts */}
                  <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-slate-700/50">
                    <h2 className="text-2xl font-bold text-white mb-4">Recent Posts</h2>
                    <div className="space-y-3">
                      {stats.recentPosts?.map((p) => (
                        <div key={p._id} className="bg-slate-900/30 rounded-xl p-3">
                          <div className="text-purple-400 font-medium text-sm mb-1">{p.anonymousName}</div>
                          <div className="text-gray-300 text-sm line-clamp-2">{p.content}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {new Date(p.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <div className="flex gap-4 mb-6">
                  <input
                    type="text"
                    placeholder="Search users by email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 outline-none"
                  >
                    <option value="">All Roles</option>
                    <option value="user">User</option>
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-slate-700/50">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-700">
                          <th className="text-left text-gray-400 font-medium p-4">Email</th>
                          <th className="text-left text-gray-400 font-medium p-4">Role</th>
                          <th className="text-left text-gray-400 font-medium p-4">Status</th>
                          <th className="text-left text-gray-400 font-medium p-4">Joined</th>
                          <th className="text-left text-gray-400 font-medium p-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u) => (
                          <tr key={u._id} className="border-b border-slate-700/30 hover:bg-slate-700/20">
                            <td className="p-4 text-white">{u.email}</td>
                            <td className="p-4">
                              {user.role === 'admin' ? (
                                <select
                                  value={u.role}
                                  onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                  className="px-3 py-1 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
                                  disabled={u.role === 'admin' && u.email === user.email}
                                >
                                  <option value="user">User</option>
                                  <option value="staff">Staff</option>
                                  <option value="admin">Admin</option>
                                </select>
                              ) : (
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  u.role === 'admin' ? 'bg-purple-500/20 text-purple-300' :
                                  u.role === 'staff' ? 'bg-blue-500/20 text-blue-300' :
                                  'bg-gray-500/20 text-gray-300'
                                }`}>
                                  {u.role}
                                </span>
                              )}
                            </td>
                            <td className="p-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                u.isActive ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                              }`}>
                                {u.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="p-4 text-gray-400 text-sm">
                              {new Date(u.createdAt).toLocaleDateString()}
                            </td>
                            <td className="p-4">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleToggleStatus(u._id)}
                                  className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-all text-sm"
                                  title={u.isActive ? 'Deactivate' : 'Activate'}
                                >
                                  {u.isActive ? 'Deactivate' : 'Activate'}
                                </button>
                                {user.role === 'admin' && u.role !== 'admin' && (
                                  <button
                                    onClick={() => handleDeleteUser(u._id)}
                                    className="px-3 py-1 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all text-sm"
                                    title="Delete"
                                  >
                                    Delete
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Posts Tab */}
            {activeTab === 'posts' && (
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-slate-700/50">
                <div className="space-y-4">
                  {posts.map((post) => (
                    <div key={post._id} className="bg-slate-900/30 rounded-xl p-4 border border-slate-700">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="text-purple-400 font-medium">{post.anonymousName}</div>
                          <div className="text-sm text-gray-500">
                            {post.user?.email} • {new Date(post.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleToggleModeration(post._id)}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                              post.isModerated
                                ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                                : 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20'
                            }`}
                          >
                            {post.isModerated ? 'Approved' : 'Hidden'}
                          </button>
                          <button
                            onClick={() => handleDeletePost(post._id)}
                            className="px-3 py-1 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-300">{post.content}</p>
                      <div className="flex gap-4 mt-3 text-sm text-gray-500">
                        <span>💬 {post.comments?.length || 0} comments</span>
                        <span>❤️ {post.reactions?.length || 0} reactions</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-slate-700/50">
                <h2 className="text-2xl font-bold text-white mb-6">Reported Posts</h2>
                
                {reportedPosts.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">✅</div>
                    <p className="text-gray-400 text-lg">No pending reports</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {reportedPosts.map((post) => (
                      <div key={post._id} className="bg-slate-900/30 rounded-xl p-6 border border-red-500/30">
                        {/* Post Content */}
                        <div className="mb-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="text-purple-400 font-medium">{post.anonymousName}</div>
                              <div className="text-sm text-gray-500">
                                {post.user?.email} • {new Date(post.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                            <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-xs font-medium">
                              {post.reportCount} {post.reportCount === 1 ? 'Report' : 'Reports'}
                            </span>
                          </div>
                          <p className="text-gray-300 mb-3">{post.content}</p>
                          <div className="flex gap-4 text-sm text-gray-500">
                            <span>💬 {post.comments?.length || 0} comments</span>
                            <span>❤️ {post.reactions?.length || 0} reactions</span>
                          </div>
                        </div>

                        {/* Reports List */}
                        <div className="border-t border-slate-700 pt-4 space-y-3">
                          <h3 className="text-white font-medium mb-3">Reports:</h3>
                          {post.reports?.map((report) => (
                            <div key={report._id} className="bg-slate-800/50 rounded-lg p-4">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <div className="text-sm text-gray-400">
                                    Reported by: {report.user?.email || 'Unknown'}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {new Date(report.createdAt).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </div>
                                </div>
                                <span className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-xs font-medium">
                                  {report.reason}
                                </span>
                              </div>
                              {report.description && (
                                <p className="text-gray-400 text-sm mt-2">{report.description}</p>
                              )}
                              
                              {/* Report Actions */}
                              <div className="flex gap-2 mt-3">
                                <button
                                  onClick={() => handleUpdateReportStatus(post._id, report._id, 'resolved')}
                                  className="px-3 py-1 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-all text-sm"
                                >
                                  Resolve
                                </button>
                                <button
                                  onClick={() => handleUpdateReportStatus(post._id, report._id, 'dismissed')}
                                  className="px-3 py-1 bg-gray-500/10 text-gray-400 rounded-lg hover:bg-gray-500/20 transition-all text-sm"
                                >
                                  Dismiss
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Post Actions */}
                        <div className="border-t border-slate-700 pt-4 mt-4 flex gap-2">
                          <button
                            onClick={() => handleToggleModeration(post._id)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                              post.isModerated
                                ? 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20'
                                : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                            }`}
                          >
                            {post.isModerated ? 'Hide Post' : 'Approve Post'}
                          </button>
                          <button
                            onClick={() => handleDeletePost(post._id)}
                            className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all text-sm font-medium"
                          >
                            Delete Post
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Announcements Tab */}
            {activeTab === 'announcements' && (
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-slate-700/50">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Announcements</h2>
                  <button
                    onClick={() => setShowAnnouncementModal(true)}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all font-medium"
                  >
                    + Create Announcement
                  </button>
                </div>

                {announcements.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📢</div>
                    <p className="text-gray-400 text-lg">No announcements yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {announcements.map((announcement) => (
                      <div key={announcement._id} className="bg-slate-900/30 rounded-xl p-4 border border-slate-700">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-bold text-white">{announcement.title}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                announcement.type === 'success' ? 'bg-green-500/20 text-green-300' :
                                announcement.type === 'warning' ? 'bg-yellow-500/20 text-yellow-300' :
                                announcement.type === 'info' ? 'bg-blue-500/20 text-blue-300' :
                                'bg-purple-500/20 text-purple-300'
                              }`}>
                                {announcement.type}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                announcement.isActive ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'
                              }`}>
                                {announcement.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                            <p className="text-gray-300 mb-2">{announcement.content}</p>
                            <div className="text-sm text-gray-500">
                              Created by: {announcement.createdBy?.email} • 
                              {new Date(announcement.createdAt).toLocaleDateString()}
                              {announcement.expiresAt && ` • Expires: ${new Date(announcement.expiresAt).toLocaleDateString()}`}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleToggleAnnouncementStatus(announcement._id)}
                              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                                announcement.isActive
                                  ? 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20'
                                  : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                              }`}
                            >
                              {announcement.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              onClick={() => handleDeleteAnnouncement(announcement._id)}
                              className="px-3 py-1 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Announcement Modal */}
      {showAnnouncementModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-3xl shadow-2xl p-8 max-w-2xl w-full border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-6">Create Announcement</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
                <input
                  type="text"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="Enter announcement title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Content *</label>
                <textarea
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                  rows="4"
                  placeholder="Enter announcement content"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                <select
                  value={newAnnouncement.type}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, type: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-purple-500 outline-none"
                >
                  <option value="announcement">Announcement</option>
                  <option value="info">Info</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Expires At (optional)</label>
                <input
                  type="datetime-local"
                  value={newAnnouncement.expiresAt}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, expiresAt: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={handleCreateAnnouncement}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                Create Announcement
              </button>
              <button
                onClick={() => {
                  setShowAnnouncementModal(false);
                  setNewAnnouncement({ title: '', content: '', type: 'announcement', expiresAt: '' });
                }}
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

export default AdminDashboard;

