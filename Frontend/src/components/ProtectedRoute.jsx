import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import Loading from "./Loading";

import config from "../config";
const BaseURL = config.BASE_URL;

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  // get user data form the backend
  const checkAuthStatus = async () => {
    try {
      const response = await fetch(`${BaseURL}/api/user/check-auth`, {
        credentials: "include", // Important for sending cookies
      });
      const data = await response.json();
      console.log("is authentic : ", data.isAuthenticated);
      console.log("User Data in checkauth:", data.user);
      return data;
    } catch (error) {
      console.error(" Authetication error:", error);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const userData = await checkAuthStatus();

      try {
        // Decode token to get user role
        try {
          setUserRole(userData.user.role);
        } catch (error) {
          console.error("Token decode error:", error);
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Verify token with backend
        const response = await fetch(`${BaseURL}/api/user/check-auth`, {
          credentials: "include",
        });

        const data = await response.json();
        setIsAuthenticated(data.isAuthenticated);
      } catch (error) {
        console.error("Auth check failed:", error);
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
    return (
      <Navigate
        to="/error"
        state={{ from: location.pathname, reason: "auth" }}
        replace
      />
    );
  }

  // Check if user has required role (if specified)
  if (requiredRole && userRole !== requiredRole) {
    return (
      <Navigate
        to="/error"
        state={{
          from: location.pathname,
          reason: "role",
          userRole,
          requiredRole,
        }}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;
