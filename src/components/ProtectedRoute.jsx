// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

// Component to protect routes that require authentication
function ProtectedRoute({ children, requireRole = null }) {
  const token = localStorage.getItem('token');
  const userRaw = localStorage.getItem('user');
  
  // Check if user is logged in
  if (!token || !userRaw) {
    // Redirect to auth page if not logged in
    return <Navigate to="/auth" replace />;
  }

  // Check role if required
  if (requireRole) {
    try {
      const user = JSON.parse(userRaw);
      const userRole = user.role;
      
      if (userRole !== requireRole) {
        // Redirect to appropriate page based on role
        if (userRole === 'walker') {
          return <Navigate to="/walkers" replace />;
        } else {
          return <Navigate to="/" replace />;
        }
      }
    } catch (e) {
      console.error('Error parsing user data:', e);
      return <Navigate to="/auth" replace />;
    }
  }

  // If all checks pass, render the protected content
  return children;
}

export default ProtectedRoute;
