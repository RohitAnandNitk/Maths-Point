import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { rippleEffect } from '../utils/rippleEffect';
import Loading from '../components/Loading';



function Signup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        password: '',
        role: 'student'  // Default role is student
    });
    const [studentActive, setStudentActive] = useState(true);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(''); // Clear error when user types
    };

    const handleRoleActive = (role) => {
        setStudentActive(role === "Student");
        setFormData(prev => ({
            ...prev,
            role: role.toLowerCase()  // Convert to lowercase for consistency
        }));
    };

    const handleSubmit = async (e) => {
        setIsLoading(true);
        e.preventDefault();
        try {
            // Explicitly set the role based on the active button
            const roleToUse = studentActive ? 'student' : 'teacher';
            
            const response = await fetch('http://localhost:5000/api/user/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    fullname: formData.fullname,
                    email: formData.email,
                    password: formData.password,
                    role: roleToUse
                })
            });

            const data = await response.json();

            if (response.ok) {
                setError(false);
                setTimeout(() => {
                    navigate('/');
                    window.location.reload();
                }, 1000);
            } else {
                setIsLoading(false);
                setError(data.message || 'Registration failed');
                console.error('Registration failed:', data.message);
            }
        } catch (error) {
            setIsLoading(false);
            setError('Network error. Please try again.');
            console.error('Registration error:', error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-white">
            {isLoading ? (
                <Loading />
            ) : (
                <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg"
            >
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800">Create your account</h1>
                    <p className="mt-2 text-sm text-gray-600">Join EduAssess to get started</p>
                </div>

                {/* Show error message if exists */}
                {error && (
                    <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
                        {error}
                    </div>
                )}

                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                    {/* Full Name Field */}
                    <div>
                        <label htmlFor="full-name" className="block text-sm font-medium text-gray-700">
                            Full Name
                        </label>
                        <div className="relative mt-1 rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <User className="w-5 h-5 text-gray-400" />
                            </div>
                            <input
                                onChange={handleChange}
                                name="fullname"
                                value={formData.fullname}
                                type="text"
                                id="full-name"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter your full name"
                            />
                        </div>
                    </div>

                    {/* Email Address Field */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <div className="relative mt-1 rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <Mail className="w-5 h-5 text-gray-400" />
                            </div>
                            <input
                                onChange={handleChange}
                                name="email"
                                value={formData.email}
                                type="email"
                                id="email"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter your email"
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <div className="relative mt-1 rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <Lock className="w-5 h-5 text-gray-400" />
                            </div>
                            <input
                                onChange={handleChange}
                                name="password"
                                value={formData.password}
                                type="password"
                                id="password"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Create a password"
                            />
                        </div>
                    </div>

                    {/* Confirm Password Field */}
                    <div>
                        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                            Confirm Password
                        </label>
                        <div className="relative mt-1 rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <Lock className="w-5 h-5 text-gray-400" />
                            </div>
                            <input
                                type="password"
                                id="confirm-password"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Confirm your password"
                            />
                        </div>
                    </div>

                    {/* Role Selection */}
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                            Role
                        </label>
                        <select
                            onChange={(e) => handleRoleActive(e.target.value)}
                            value={studentActive ? 'Student' : 'Teacher'}
                            id="role"
                            className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="Student">Student</option>
                            <option value="Teacher">Teacher</option>
                        </select>
                    </div>

                    {/* Sign Up Button */}
                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={rippleEffect}
                        className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ripple-container"
                    >
                        Sign Up
                    </motion.button>
                </form>

                {/* Login Link */}
                <p className="mt-4 text-sm text-center text-gray-600">
                    Already have an account?{' '}
                    <Link to="/signin" className="text-blue-600 hover:underline">
                        Log in
                    </Link>
                </p>
            </motion.div>
            )}
        </div>
    
    );
}

export default Signup;
