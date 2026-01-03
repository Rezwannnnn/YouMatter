import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { journalAPI } from '../api/moodAPI';

const Journal = () => {
  const [journals, setJournals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    mood: '',
    tags: [],
  });

  const moodOptions = [
    { value: 'very-happy', label: 'Very Happy', emoji: '😄' },
    { value: 'happy', label: 'Happy', emoji: '😊' },
    { value: 'neutral', label: 'Neutral', emoji: '😐' },
    { value: 'sad', label: 'Sad', emoji: '😢' },
    { value: 'very-sad', label: 'Very Sad', emoji: '😭' },
  ];

  useEffect(() => {
    fetchJournals();
  }, [searchTerm]);

  const fetchJournals = async () => {
    try {
      const params = searchTerm ? { search: searchTerm } : {};
      const data = await journalAPI.getJournals(params);
      setJournals(data.journals || []);
    } catch (error) {
      console.error('Error fetching journals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        const data = await journalAPI.updateJournal(editingId, formData);
        if (data.journal) {
          setJournals(journals.map(j => j._id === editingId ? data.journal : j));
          alert('Journal updated successfully!');
        }
      } else {
        const data = await journalAPI.createJournal(formData);
        if (data.journal) {
          setJournals([data.journal, ...journals]);
          alert('Journal entry created successfully!');
        }
      }
      
      resetForm();
    } catch (error) {
      console.error('Error saving journal:', error);
      alert('Failed to save journal');
    }
  };

  const handleEdit = (journal) => {
    setFormData({
      title: journal.title,
      content: journal.content,
      mood: journal.mood || '',
      tags: journal.tags || [],
    });
    setEditingId(journal._id);
    setShowForm(true);
  };

  const handleDelete = async (journalId) => {
    if (!confirm('Are you sure you want to delete this journal entry?')) return;
    
    try {
      await journalAPI.deleteJournal(journalId);
      setJournals(journals.filter(j => j._id !== journalId));
      alert('Journal deleted successfully!');
    } catch (error) {
      console.error('Error deleting journal:', error);
      alert('Failed to delete journal');
    }
  };

  const resetForm = () => {
    setFormData({ title: '', content: '', mood: '', tags: [] });
    setEditingId(null);
    setShowForm(false);
  };

  const getMoodEmoji = (mood) => {
    return moodOptions.find(m => m.value === mood)?.emoji || '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="relative z-50 bg-slate-900/95 backdrop-blur-lg shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              YouMatter
            </Link>
            <div className="flex gap-4 items-center">
              <Link to="/mood" className="text-white hover:text-purple-300 transition-colors font-medium">
                Mood Tracker
              </Link>
              <Link to="/journal" className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
                Journal
              </Link>
              <Link to="/community" className="text-white hover:text-purple-300 transition-colors font-medium">
                Community
              </Link>
              <Link to="/profile" className="text-white hover:text-purple-300 transition-colors font-medium">
                Profile
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-5xl font-bold text-white mb-2">My Journal</h1>
            <p className="text-xl text-gray-400">Your private space for reflection</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
          >
            {showForm ? 'Cancel' : '+ New Entry'}
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search your journals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-4 bg-slate-800/50 border border-slate-700 rounded-2xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 outline-none"
          />
        </div>

        {/* Journal Form */}
        {showForm && (
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-slate-700/50 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingId ? 'Edit Entry' : 'New Journal Entry'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Give your entry a title..."
                  required
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">How are you feeling?</label>
                <div className="grid grid-cols-5 gap-3">
                  {moodOptions.map((mood) => (
                    <button
                      key={mood.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, mood: mood.value })}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        formData.mood === mood.value
                          ? 'bg-purple-500/20 border-purple-500 text-white'
                          : 'bg-slate-900/50 border-slate-600 text-gray-400 hover:border-slate-500'
                      }`}
                    >
                      <div className="text-2xl mb-1">{mood.emoji}</div>
                      <div className="text-xs">{mood.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Your Thoughts</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write your thoughts, feelings, and reflections..."
                  required
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                  rows="8"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
                >
                  {editingId ? 'Update Entry' : 'Save Entry'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 bg-slate-700 text-white rounded-xl font-semibold hover:bg-slate-600 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Journal Entries */}
        {isLoading ? (
          <div className="text-center py-12 text-gray-400">Loading your journals...</div>
        ) : journals.length === 0 ? (
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-3xl p-12 text-center border border-slate-700/30">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-gray-400 text-lg mb-4">
              {searchTerm ? 'No journals found matching your search' : 'No journal entries yet'}
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              Create Your First Entry
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {journals.map((journal) => (
              <div key={journal._id} className="bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-slate-700/50 hover:border-purple-500/30 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {journal.mood && (
                        <span className="text-2xl">{getMoodEmoji(journal.mood)}</span>
                      )}
                      <h3 className="text-2xl font-bold text-white">{journal.title}</h3>
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(journal.createdAt).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(journal)}
                      className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                      title="Edit"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(journal._id)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                      title="Delete"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {journal.content}
                </p>
                {journal.tags && journal.tags.length > 0 && (
                  <div className="flex gap-2 mt-4">
                    {journal.tags.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Journal;

