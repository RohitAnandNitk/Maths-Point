import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import Loading from './Loading';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if token exists in cookies
        const token = Cookies.get('token');
        
        if (!token) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }
        
        // Decode token to get user role
        try {
          const decoded = jwtDecode(token);
          setUserRole(decoded.role);
        } catch (error) {
          console.error('Token decode error:', error);
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }
        
        // Verify token with backend
        const response = await fetch('http://localhost:5000/api/user/check-auth', {
          credentials: 'include'
        });
        
        const data = await response.json();
        setIsAuthenticated(data.isAuthenticated);
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  if (isLoading) {
    return <Loading />;
  }
  
  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/error" state={{ from: location.pathname, reason: 'auth' }} replace />;
  }
  
  // Check if user has required role (if specified)
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/error" state={{ from: location.pathname, reason: 'role', userRole, requiredRole }} replace />;
  }
  
  return children;
};

export default ProtectedRoute; 