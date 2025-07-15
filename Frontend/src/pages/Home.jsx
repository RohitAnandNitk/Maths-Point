import React, { useEffect, useState } from 'react'
import logo from '../assets/Home.jpg'
// const logo = ''
import { motion } from 'framer-motion'
import {rippleEffect} from '../utils/rippleEffect'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import Cookies from 'js-cookie'



function Home() {
    const navigate = useNavigate();

    const [isTeacher, setIsTeacher] = useState(false);
    const handleCreateTestChange = () => {
        console.log('Create Test clicked');
        navigate('/create-test');
    }

    const handleTakeTestChange = () => {
        console.log('Take Test clicked');
        navigate('/exam');
    }

    useEffect(() => {
        const token = Cookies.get('token');
        if(token) {
          try {
            const decoded = jwtDecode(token);
            // Set the fullName from token data
            if(decoded.role === 'student'){
                setIsTeacher(false);
            }else{
                setIsTeacher(true);
            }
          } catch (error) {
            setIsTeacher(false);
            console.error("Token decode error:", error);
          }
        }
      }, []);
    return (
        <motion.div
            
        >
            {/* Hero Section */}
            <div className="flex items-center justify-between px-20 py-16">
                <div className="w-1/2">
                    <h1 className="text-4xl font-bold mb-4">
                        Empower <span className='text-pink-600'>Education</span> Through Effective <span className='text-pink-600'>Assessment</span>
                    </h1>
                    <p className="text-gray-600 mb-8">
                        Transform your teaching experience with our intelligent assessment platform that makes creating, managing, and grading tests effortless.
                    </p>
                    <div className="space-x-4">
                        {isTeacher && (<button 
                            className="bg-black text-white px-6 py-2 rounded transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-gray-800  ripple-container"
                            // onClick={rippleEffect}
                            onClick={handleCreateTestChange}
                        >
                            Create a Test
                        </button>)} 
                        
                        <button 
                            className="border border-blue-600 bg-blue-600 text-white px-6 py-2 rounded transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-500 hover:text-white ripple-container"
                            // onClick={rippleEffect}
                            onClick={handleTakeTestChange}
                        >
                            Take a Test
                        </button>
                    </div>
                </div>
                <div className="w-1/2">
                    <motion.div
                        animate={{
                            y: [-10, 10, -10],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <img
                            src={logo}
                            alt="Students working"
                            className="rounded-lg w-full h-auto"
                            style={{
                                backgroundColor: 'transparent',
                                maxWidth: '500px',
                                margin: '0 auto'
                            }}
                        />
                    </motion.div>
                </div>
            </div>

            {/* Key Features */}
            <div className="py-16 px-20">
                <motion.h2 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-3xl font-bold text-center mb-12"
                >
                    Key Features
                </motion.h2>
                <div className="grid grid-cols-3 gap-8">
                    {[
                        {
                            icon: "📝",
                            title: "Test Creation",
                            description: "Create professional tests with our intuitive interface. Multiple question types, customizable templates, and instant preview."
                        },
                        {
                            icon: "🔒",
                            title: "Secure Environment",
                            description: "Advanced proctoring features, encrypted data transmission, and secure test delivery system."
                        },
                        {
                            icon: "📊",
                            title: "Analytics",
                            description: "Comprehensive analytics and insights. Track performance, identify trends, and generate detailed reports."
                        }
                    ].map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            viewport={{ once: true }}
                            className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
                        >
                            <div className="text-blue-600 mb-4">{feature.icon}</div>
                            <h3 className="font-semibold mb-2">{feature.title}</h3>
                            <p className="text-gray-600">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* How It Works */}
            <div className="bg-gray-50 py-16 px-20">
                <motion.h2 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-3xl font-bold text-center mb-12"
                >
                    How It Works
                </motion.h2>
                <div className="grid grid-cols-3 gap-8 text-center">
                    {[
                        {
                            step: 1,
                            title: "Create Account",
                            description: "Sign up as an educator or student and set up your profile in minutes."
                        },
                        {
                            step: 2,
                            title: "Design Tests",
                            description: "Use our tools to create engaging assessments or take assigned tests."
                        },
                        {
                            step: 3,
                            title: "Track Progress",
                            description: "Monitor results and improve learning outcomes with detailed insights."
                        }
                    ].map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            viewport={{ once: true }}
                        >
                            <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4">
                                {step.step}
                            </div>
                            <h3 className="font-semibold mb-2">{step.title}</h3>
                            <p className="text-gray-600">{step.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Newsletter Section */}
            <div className="bg-blue-600 text-white py-12 px-20 text-center">
                <h2 className="text-2xl font-bold mb-4">Stay Updated with Educational Trends</h2>
                <div className="max-w-md mx-auto flex gap-4">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="flex-1 px-4 py-2 rounded text-gray-900 bg-white"
                    />
                    <button className="bg-white text-blue-600 px-6 py-2 rounded hover:bg-gray-200 transition-all duration-300 ease-in-out transform hover:scale-105">
                        Subscribe
                    </button>
                </div>
            </div>
        </motion.div>
    )
}

export default Home
