import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Homepage from './routes/Homepage';
import Login from './routes/Login';
import Register from './routes/Register';
import UserProfile from './routes/UserProfile';
import Community from './routes/Community';
import MoodTracker from './routes/MoodTracker';
import Journal from './routes/Journal';
import AdminDashboard from './routes/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import GuestRoute from './components/GuestRoute';

const App = () => (
  <Router>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route 
          path="/login" 
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          } 
        />
        <Route path="/community" element={<Community />} />
        <Route 
          path="/mood" 
          element={
            <ProtectedRoute>
              <MoodTracker />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/journal" 
          element={
            <ProtectedRoute>
              <Journal />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  </Router>
);

export default App;