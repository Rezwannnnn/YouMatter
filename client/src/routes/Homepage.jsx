import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import announcementAPI from '../api/announcementAPI';
import quoteAPI from '../api/quoteAPI';

const Homepage = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [dailyQuote, setDailyQuote] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!(token && user));

    // Fetch announcements and daily quote
    fetchAnnouncements();
    fetchDailyQuote();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const data = await announcementAPI.getActiveAnnouncements();
      setAnnouncements(data.announcements || []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  const fetchDailyQuote = async () => {
    try {
      const data = await quoteAPI.getDailyQuote();
      setDailyQuote(data.quote);
    } catch (error) {
      console.error('Error fetching daily quote:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      {/* Floating Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-slate-900/95 backdrop-blur-lg shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              YouMatter
            </div>
            <div className="flex gap-4 items-center">
              <Link to="/community" className="text-white hover:text-purple-300 transition-colors font-medium">
                Community
              </Link>
              {isLoggedIn ? (
                <Link to="/profile" className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-purple-500/50 font-medium">
                  My Profile
                </Link>
              ) : (
                <>
                  <Link to="/login" className="px-6 py-2 text-white hover:text-purple-300 transition-colors font-medium">
                    Sign In
                  </Link>
                  <Link to="/register" className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-purple-500/50 font-medium">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Quote of the Day Banner */}
        {dailyQuote && (
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-t border-purple-500/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
              <div className="flex items-center gap-3">
                <div className="text-2xl">💭</div>
                <div className="flex-1">
                  <p className="text-sm text-purple-300 font-medium">Quote of the Day</p>
                  <p className="text-white italic text-sm">"{dailyQuote.text}"</p>
                  <p className="text-xs text-gray-400 mt-1">— {dailyQuote.author}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <div className="inline-block px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-300 text-sm font-medium mb-4">
              ✨ Your Mental Wellness Companion
            </div>

            <h1 className="text-6xl md:text-8xl font-bold">
              <span className="block text-white mb-4">You</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 animate-gradient">
                Matter
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              A safe, private sanctuary for self-reflection, mood tracking, and community support.
              Your journey to mental wellness begins here.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              {isLoggedIn ? (
                <Link
                  to="/profile"
                  className="group px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-2xl hover:shadow-purple-500/50 flex items-center gap-2 hover:scale-105"
                >
                  Go to My Profile
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="group px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-2xl hover:shadow-purple-500/50 flex items-center gap-2 hover:scale-105"
                  >
                    Begin Your Journey
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                  <Link
                    to="/login"
                    className="px-8 py-4 bg-white/5 backdrop-blur-sm text-white border-2 border-white/20 rounded-full font-semibold text-lg hover:bg-white/10 hover:border-white/40 transition-all"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>

            {/* Announcements */}
            {announcements && announcements.length > 0 && (
              <div className="mt-12 space-y-4">
                {announcements.map((announcement) => (
                  <div
                    key={announcement._id}
                    className={`relative overflow-hidden backdrop-blur-xl rounded-2xl p-6 border shadow-xl ${announcement.type === 'success'
                        ? 'bg-green-500/10 border-green-500/30'
                        : announcement.type === 'warning'
                          ? 'bg-yellow-500/10 border-yellow-500/30'
                          : announcement.type === 'info'
                            ? 'bg-blue-500/10 border-blue-500/30'
                            : 'bg-purple-500/10 border-purple-500/30'
                      }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">
                        {announcement.type === 'success' ? '✅' : announcement.type === 'warning' ? '⚠️' : announcement.type === 'info' ? 'ℹ️' : '📢'}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2">{announcement.title}</h3>
                        <p className="text-gray-300">{announcement.content}</p>
                        <p className="text-xs text-gray-500 mt-3">
                          Posted {new Date(announcement.createdAt).toLocaleDateString()}
                          {announcement.expiresAt && ` • Expires ${new Date(announcement.expiresAt).toLocaleDateString()}`}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-8 pt-12 text-gray-400 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                100% Private & Secure
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                10K+ Active Users
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                Free Forever
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-block px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-300 text-sm font-medium mb-6">
              Powerful Features
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Your Wellness Toolkit
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to support your mental health journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 - Mood Tracking */}
            <div className="group relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-8 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/50">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Mood Tracking</h3>
                <p className="text-gray-400 leading-relaxed">
                  Track your daily moods with visual charts and patterns. Gain insights into your emotional well-being over time.
                </p>
              </div>
            </div>

            {/* Feature 2 - Personal Journal */}
            <div className="group relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-8 hover:border-pink-500/50 transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-pink-500/50">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Personal Journal</h3>
                <p className="text-gray-400 leading-relaxed">
                  Private journaling space for your thoughts and reflections. Create, edit, and search your entries securely.
                </p>
              </div>
            </div>

            {/* Feature 3 - Community Support */}
            <div className="group relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-8 hover:border-indigo-500/50 transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-indigo-500/50">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Community Wall</h3>
                <p className="text-gray-400 leading-relaxed">
                  Share and connect anonymously in a supportive, moderated community. Find understanding and encouragement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group p-6 bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 rounded-2xl hover:border-purple-500/50 transition-all hover:scale-105">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h4 className="font-bold text-white mb-2">Analytics Dashboard</h4>
              <p className="text-sm text-gray-400">Visual insights into your mood patterns</p>
            </div>
            <div className="group p-6 bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 rounded-2xl hover:border-pink-500/50 transition-all hover:scale-105">
              <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h4 className="font-bold text-white mb-2">Resource Library</h4>
              <p className="text-sm text-gray-400">Curated self-help resources</p>
            </div>
            <div className="group p-6 bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 rounded-2xl hover:border-indigo-500/50 transition-all hover:scale-105">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-bold text-white mb-2">Streak Tracking</h4>
              <p className="text-sm text-gray-400">Build positive habits daily</p>
            </div>
            <div className="group p-6 bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 rounded-2xl hover:border-blue-500/50 transition-all hover:scale-105">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h4 className="font-bold text-white mb-2">Daily Reminders</h4>
              <p className="text-sm text-gray-400">Stay consistent with notifications</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-purple-900/50 to-slate-900"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="group space-y-3 p-6 rounded-2xl hover:bg-white/5 transition-all">
              <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                10K+
              </div>
              <div className="text-gray-400 text-lg group-hover:text-gray-300 transition-colors">Active Users</div>
            </div>
            <div className="group space-y-3 p-6 rounded-2xl hover:bg-white/5 transition-all">
              <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                50K+
              </div>
              <div className="text-gray-400 text-lg group-hover:text-gray-300 transition-colors">Journal Entries</div>
            </div>
            <div className="group space-y-3 p-6 rounded-2xl hover:bg-white/5 transition-all">
              <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
                24/7
              </div>
              <div className="text-gray-400 text-lg group-hover:text-gray-300 transition-colors">Support Available</div>
            </div>
            <div className="group space-y-3 p-6 rounded-2xl hover:bg-white/5 transition-all">
              <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                100%
              </div>
              <div className="text-gray-400 text-lg group-hover:text-gray-300 transition-colors">Private & Secure</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-indigo-500/30 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-block px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-300 text-sm font-medium mb-6">
            ✨ Join Our Community
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Ready to Begin Your
            <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
              Wellness Journey?
            </span>
          </h2>
          <p className="text-xl text-gray-400 mb-12 leading-relaxed max-w-2xl mx-auto">
            Join thousands of users taking control of their mental wellness. Start tracking, reflecting, and growing today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isLoggedIn ? (
              <Link
                to="/profile"
                className="group px-10 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-bold text-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-2xl hover:shadow-purple-500/50 hover:scale-105 flex items-center justify-center gap-2"
              >
                Go to Dashboard
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="group px-10 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-bold text-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-2xl hover:shadow-purple-500/50 hover:scale-105 flex items-center justify-center gap-2"
                >
                  Get Started Free
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  to="/login"
                  className="px-10 py-4 bg-white/5 backdrop-blur-sm border-2 border-white/20 text-white rounded-full font-bold text-lg hover:bg-white/10 hover:border-white/40 transition-all"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              YouMatter
            </div>
            <p className="text-gray-500 text-sm">
              © 2026 YouMatter. Your mental wellness companion.
            </p>
            <div className="flex gap-6 text-gray-500 text-sm">
              <a href="#" className="hover:text-purple-400 transition-colors">Privacy</a>
              <a href="#" className="hover:text-purple-400 transition-colors">Terms</a>
              <a href="#" className="hover:text-purple-400 transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;