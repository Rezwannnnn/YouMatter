import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { moodAPI } from '../api/moodAPI';

const MoodTracker = () => {
  const [moods, setMoods] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [selectedMood, setSelectedMood] = useState('');
  const [intensity, setIntensity] = useState(5);
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const moodOptions = [
    { value: 'very-happy', label: 'Very Happy', emoji: '😄', color: 'from-green-400 to-green-600' },
    { value: 'happy', label: 'Happy', emoji: '😊', color: 'from-blue-400 to-blue-600' },
    { value: 'neutral', label: 'Neutral', emoji: '😐', color: 'from-yellow-400 to-yellow-600' },
    { value: 'sad', label: 'Sad', emoji: '😢', color: 'from-orange-400 to-orange-600' },
    { value: 'very-sad', label: 'Very Sad', emoji: '😭', color: 'from-red-400 to-red-600' },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [moodsData, analyticsData] = await Promise.all([
        moodAPI.getMoods({ limit: 30 }),
        moodAPI.getMoodAnalytics(30),
      ]);
      setMoods(moodsData.moods || []);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error fetching mood data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMood) return;

    setIsSaving(true);
    try {
      const data = await moodAPI.createMood({
        mood: selectedMood,
        intensity,
        note,
      });
      if (data.mood) {
        setMoods([data.mood, ...moods]);
        setSelectedMood('');
        setIntensity(5);
        setNote('');
        fetchData(); // Refresh analytics
        alert('Mood logged successfully!');
      }
    } catch (error) {
      console.error('Error creating mood:', error);
      alert('Failed to log mood');
    } finally {
      setIsSaving(false);
    }
  };

  const getMoodEmoji = (mood) => {
    return moodOptions.find(m => m.value === mood)?.emoji || '😐';
  };

  const getMoodLabel = (mood) => {
    return moodOptions.find(m => m.value === mood)?.label || mood;
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
              <Link to="/mood" className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
                Mood Tracker
              </Link>
              <Link to="/journal" className="text-white hover:text-purple-300 transition-colors font-medium">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Mood Tracker</h1>
          <p className="text-xl text-gray-400">Track your emotional journey and discover patterns</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Mood Entry Form */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-slate-700/50 sticky top-8">
              <h2 className="text-2xl font-bold text-white mb-6">How are you feeling?</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Mood Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">Select your mood</label>
                  <div className="grid grid-cols-2 gap-3">
                    {moodOptions.map((mood) => (
                      <button
                        key={mood.value}
                        type="button"
                        onClick={() => setSelectedMood(mood.value)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          selectedMood === mood.value
                            ? `bg-gradient-to-br ${mood.color} border-transparent text-white`
                            : 'bg-slate-900/50 border-slate-600 text-gray-300 hover:border-slate-500'
                        }`}
                      >
                        <div className="text-3xl mb-2">{mood.emoji}</div>
                        <div className="text-sm font-medium">{mood.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Intensity Slider */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Intensity: <span className="text-purple-400">{intensity}/10</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={intensity}
                    onChange={(e) => setIntensity(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                </div>

                {/* Note */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Note (optional)</label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="What's on your mind?"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                    rows="3"
                    maxLength={500}
                  />
                </div>

                <button
                  type="submit"
                  disabled={!selectedMood || isSaving}
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Saving...' : 'Log Mood'}
                </button>
              </form>
            </div>
          </div>

          {/* Right: Analytics & History */}
          <div className="lg:col-span-2 space-y-8">
            {/* Analytics Cards */}
            {analytics && (
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                    {analytics.currentStreak}
                  </div>
                  <div className="text-gray-400">Day Streak 🔥</div>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                    {analytics.longestStreak}
                  </div>
                  <div className="text-gray-400">Longest Streak</div>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                  <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                    {analytics.totalEntries}
                  </div>
                  <div className="text-gray-400">Total Entries</div>
                </div>
              </div>
            )}

            {/* Mood History */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-slate-700/50">
              <h2 className="text-2xl font-bold text-white mb-6">Recent Entries</h2>
              
              {isLoading ? (
                <div className="text-center py-8 text-gray-400">Loading...</div>
              ) : moods.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  No mood entries yet. Start tracking your mood today!
                </div>
              ) : (
                <div className="space-y-4">
                  {moods.map((mood) => (
                    <div key={mood._id} className="bg-slate-900/30 rounded-xl p-4 border border-slate-700">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{getMoodEmoji(mood.mood)}</span>
                          <div>
                            <div className="text-white font-medium">{getMoodLabel(mood.mood)}</div>
                            <div className="text-sm text-gray-500">
                              {new Date(mood.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                          </div>
                        </div>
                        <div className="text-purple-400 font-bold">{mood.intensity}/10</div>
                      </div>
                      {mood.note && (
                        <p className="text-gray-400 text-sm mt-2">{mood.note}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;

