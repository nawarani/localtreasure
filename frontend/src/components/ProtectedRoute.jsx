import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className ="loading">Loading...</div>;
}
  return isAuthenticated ? children : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;