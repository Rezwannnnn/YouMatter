import React from 'react';
import { Navigate } from 'react-router-dom';

export const GuestRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  // If user is already logged in, redirect to profile
  if (token && user) {
    return <Navigate to="/profile" replace />;
  }

  return children;
};

export default GuestRoute;

