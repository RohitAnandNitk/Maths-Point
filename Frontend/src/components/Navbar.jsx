import React, { useState, useEffect } from "react";
import { rippleEffect } from "../utils/rippleEffect";
import { ChevronUp, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from '../assets/logo.png'
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";

function Navbar() {
  const [isExamOpen, setIsExamOpen] = useState(false);
  const [isTestSeriesOpen, setIsTestSeriesOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState('');
  const [role, setRole] = useState('');
  // Check auth status when component mounts
  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded.fullname.charAt(0).toUpperCase() + decoded.fullname.slice(1).toLowerCase());
        console.log(decoded.fullname);
        setRole(decoded.role.charAt(0).toUpperCase())
      } catch (error) {
        setUser('')
        setRole('')
        console.error("Token decode error:", error);
      }
    }
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/user/check-auth', {
        credentials: 'include' // Important for sending cookies
      });
      const data = await response.json();
      setIsAuthenticated(data.isAuthenticated);
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
    }
  };

  //glass 
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  })

  // Check if current path is signin or signup
  const isSigninActive = location.pathname === "/signin";
  const isSignupActive = location.pathname === "/signup";

  // Handle login click
  const handleLoginClick = (e) => {
    e.preventDefault();
    if (rippleEffect) {
      rippleEffect(e);
    }
    navigate("/signin");
  };

  // Handle signup click
  const handleSignupClick = (e) => {
    e.preventDefault();
    if (rippleEffect) {
      rippleEffect(e);
    }
    navigate("/signup");
  };

  // Handle sign out
  const handleSignOut = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/user/logout', {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        setIsAuthenticated(false);
        navigate('/signin');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
      ? 'bg-white/50 backdrop-blur-md shadow-xs'
      : 'bg-white shadow-sm'
      }`}>
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <img src={logo} alt="EduAssess" className="w-10 h-10 mr-4" />
          <Link to="/" className="text-xl font-bold text-blue-600">
            EduAccess
          </Link>
        </div>

        {/* Navbar Links */}
        <div className="hidden md:flex items-center space-x-8">
          {/* Exam Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsExamOpen(true)}
            onMouseLeave={() => setIsExamOpen(false)}
          >
            <button className="text-gray-600 hover:text-blue-600 font-medium flex items-center gap-1">
              Exam{" "}
              <motion.span
                animate={{ rotate: isExamOpen ? 180 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {isExamOpen ? <ChevronUp /> : <ChevronDown />}
              </motion.span>
            </button>

            {isExamOpen && (
              <motion.div
                className="absolute left-0 mt-3 w-80 bg-white shadow-lg rounded-xl p-5 border border-gray-200 z-50"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-lg font-semibold text-blue-600 mb-3">
                  Competitive Exams
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <Link to="/exam/upsc" className="block bg-gray-100 px-4 py-2 rounded-lg hover:bg-blue-100 transition">
                    UPSC
                  </Link>
                  <Link to="/exam/gate" className="block bg-gray-100 px-4 py-2 rounded-lg hover:bg-blue-100 transition">
                    GATE
                  </Link>
                  <Link to="/exam/cat" className="block bg-gray-100 px-4 py-2 rounded-lg hover:bg-blue-100 transition">
                    CAT
                  </Link>
                  <Link to="/exam/jee" className="block bg-gray-100 px-4 py-2 rounded-lg hover:bg-blue-100 transition">
                    JEE
                  </Link>
                  <Link to="/exam/neet" className="block bg-gray-100 px-4 py-2 rounded-lg hover:bg-blue-100 transition">
                    NEET
                  </Link>
                  <Link to="/exam/ssc" className="block bg-gray-100 px-4 py-2 rounded-lg hover:bg-blue-100 transition">
                    SSC
                  </Link>
                </div>
              </motion.div>
            )}
          </div>

          {/* Test Series Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsTestSeriesOpen(true)}
            onMouseLeave={() => setIsTestSeriesOpen(false)}
          >
            <button className="text-gray-600 hover:text-blue-600 font-medium flex items-center gap-1">
              Test Series{" "}
              <motion.span
                animate={{ rotate: isTestSeriesOpen ? 180 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {isTestSeriesOpen ? <ChevronUp /> : <ChevronDown />}
              </motion.span>
            </button>

            {isTestSeriesOpen && (
              <motion.div
                className="absolute left-0 mt-3 w-64 bg-white shadow-lg rounded-xl p-5 border border-gray-200 z-50"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-lg font-semibold text-blue-600 mb-3">
                  Available Test Series
                </h3>
                <div className="flex flex-col space-y-2">
                  <Link to="/test-series/upsc" className="block bg-gray-100 px-4 py-2 rounded-lg hover:bg-blue-100 transition">
                    UPSC Test Series
                  </Link>
                  <Link to="/test-series/gate" className="block bg-gray-100 px-4 py-2 rounded-lg hover:bg-blue-100 transition">
                    GATE Test Series
                  </Link>
                  <Link to="/test-series/cat" className="block bg-gray-100 px-4 py-2 rounded-lg hover:bg-blue-100 transition">
                    CAT Test Series
                  </Link>
                  <Link to="/test-series/jee" className="block bg-gray-100 px-4 py-2 rounded-lg hover:bg-blue-100 transition">
                    JEE Test Series
                  </Link>
                </div>
              </motion.div>
            )}
          </div>

          <Link to="/testimonial" className="text-gray-600 hover:text-blue-600">
            Testimonials
          </Link>
          <Link to="/pricing" className="text-gray-600 hover:text-blue-600">
            Pricing
          </Link>
          <Link to="/about" className="text-gray-600 hover:text-blue-600">
            About
          </Link>
          <Link to='/profile' className="text-gray-600 hover:text-blue-600">
          Profile
          </Link>
        </div>

        {/* Right Side (Login & Signup) - Updated styling */}
        <div className="flex items-center space-x-4">
          {!isAuthenticated ? (
            <>
              <button
                onClick={handleLoginClick}
                className={`px-4 py-2 rounded transition-colors duration-200 ripple-container ${isSigninActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600'
                  }`}
              >
                Login
              </button>
              <button
                onClick={handleSignupClick}
                className={`px-4 py-2 rounded transition-colors duration-200 ripple-container ${isSignupActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600'
                  }`}
              >
                Sign Up
              </button>
            </>
          ) : (
            <>

              <span className="text-gray-500 hover:text-gray-600 font-semibold font-sans">Welcome, {user}</span>

              <div className="flex items-center justify-center">
                <p className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-400 text-white">
                  {role}
                </p>
              </div>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 rounded bg-blue-600 text-white transition-colors duration-200 ripple-container hover:bg-blue-700"
              >
                Sign Out
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;