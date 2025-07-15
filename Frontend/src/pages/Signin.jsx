import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import Loading from '../components/Loading';
import ForgotPasswordCard from '../components/ForgotPasswordCard';

function Signin() {
    const [isEyeOpen, setIsEyeOpen] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'student'
    });
    const [studentActive, setStudentActive] = useState(true);
    const [error, setError] = useState(false);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleRoleActive = (role) => {
        setStudentActive(role === "Student");
        setFormData(prev => ({
            ...prev,
            role: role.toLowerCase()
        }));
    };

    const handleEyeOpen = () => {
        setIsEyeOpen((prev) => !prev);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Set loading to true when form is submitted
        
        try {
            const roleToUse = studentActive ? 'student' : 'teacher';

            console.log("Sending login request with:", {
                email: formData.email,
                password: formData.password,
                role: roleToUse
            });

            // Try the login endpoint
            let url = 'http://localhost:5000/api/user/login';
            console.log("Trying endpoint:", url);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    role: roleToUse
                })
            });

            // If you get here without an error being thrown, process the response
            const data = await response.json();
            console.log("Response data:", data);

            if (response.ok) {
                setError(false);
                // Keep loading state active during timeout
                setTimeout(() => {
                    navigate('/');
                    window.location.reload();
                }, 3000);
            } else {
                setIsLoading(false); // Hide loading on error
                setError(true);
                console.error('Login failed:', data.message);
            }
        } catch (error) {
            setIsLoading(false); // Hide loading on error
            setError(true);
            console.error('Login error:', error);
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
                        <h1 className="text-2xl font-bold text-gray-800">Sign in to your account</h1>
                        <p className="mt-2 text-sm text-gray-600">WELCOME BACK TO EDUASSESS</p>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                        <button
                            onClick={() => handleRoleActive("Student")}
                            className={`w-1/2 py-2 m-1 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${studentActive ? "bg-blue-500 focus:ring-blue-500" : "bg-gray-400 focus:ring-gray-400"
                                }`}
                        >
                            Student
                        </button>

                        <button
                            onClick={() => handleRoleActive("Teacher")}
                            className={`w-1/2 py-2 m-1 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${!studentActive ? "bg-blue-500 focus:ring-blue-500" : "bg-gray-400 focus:ring-gray-400"
                                }`}
                        >
                            Teacher
                        </button>
                    </div>

                    <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <div className="relative mt-1 rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Mail className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    name="email"
                                    onChange={handleChange}
                                    value={formData.email}
                                    type="email"
                                    id="email"
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter your email"
                                    required
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
                                    name="password"
                                    onChange={handleChange}
                                    value={formData.password}
                                    type={isEyeOpen ? "text" : "password"}
                                    id="password"
                                    className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter your password"
                                    required
                                />
                                <div
                                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                                    onClick={handleEyeOpen}
                                >
                                    {isEyeOpen ?
                                        <Eye className="w-5 h-5 text-gray-400 cursor-pointer" /> :
                                        <EyeOff className="w-5 h-5 text-gray-400 cursor-pointer" />
                                    }
                                </div>
                            </div>
                        </div>

                        {/* Remember Me and Forgot Password */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="remember-me"
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="remember-me" className="ml-2 text-sm text-gray-600">
                                    Remember me
                                </label>
                            </div>
                            <button 
                                onClick={() => setIsForgotPasswordOpen(true)}
                                className="text-sm text-blue-600 hover:underline"
                            >
                                Forgot password?
                            </button>
                        </div>

                        {/* Sign In Button */}
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ripple-container"
                        >
                            Sign in
                        </motion.button>
                    </form>

                    {/* Error Message */}
                    {error && (
                        <div className="text-red-600 text-sm mt-2 text-center" >
                            Invalid Email or Password!
                        </div>
                    )}
                    
                    {/* Sign Up Link */}
                    <p className="mt-4 text-sm text-center text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-blue-600 hover:underline">
                            Sign up
                        </Link>
                    </p>
                </motion.div>
            )}
            
            {/* Forgot Password Modal */}
            <ForgotPasswordCard 
                isOpen={isForgotPasswordOpen} 
                onClose={() => setIsForgotPasswordOpen(false)} 
            />
        </div>
    );
}

export default Signin;