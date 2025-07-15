import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Errorlogo from '../assets/Errorlogo.svg';

function Error() {
  const location = useLocation();
  const fromPage = location.state?.from || null;
  const reason = location.state?.reason || 'unknown';
  const userRole = location.state?.userRole;
  const requiredRole = location.state?.requiredRole;
  
  // Determine error message based on reason
  let errorTitle = "Page Not Found";
  let errorMessage = "The page you're looking for doesn't exist.";
  
  if (reason === 'auth') {
    errorTitle = "Access Denied";
    errorMessage = `You need to be logged in to access ${fromPage || 'this page'}.`;
  } else if (reason === 'role') {
    errorTitle = "Permission Denied";
    errorMessage = `This page requires ${requiredRole} access. Your current role (${userRole}) doesn't have permission.`;
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <img src={Errorlogo} alt="Error" className="max-w-md w-full mb-8" />
      
      <div className="text-center max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{errorTitle}</h1>
        <p className="text-gray-600 mb-6">{errorMessage}</p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {reason === 'auth' && (
            <Link 
              to="/signin" 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign In
            </Link>
          )}
          <Link 
            to="/" 
            className="border border-gray-300 bg-white text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Error;