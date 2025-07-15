import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import FounderCard from '../components/FounderCard';
import { Send } from 'lucide-react';
import { rippleEffect } from '../utils/rippleEffect';
import emailjs from '@emailjs/browser'


export default function About() {
    const form = useRef();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
        query_type: '' // Added query type field
    });


    const handleSubmit = (e) => {
        e.preventDefault();

        emailjs
            .sendForm('service_9wey7pr', 'template_tgd1otr', form.current, {
                publicKey: 'g8AAzk7gt-qfmqoD_',
            })
            .then(
                () => {
                    console.log('SUCCESS!');
                    // Reset form after successful submission
                    setFormData({
                        name: '',
                        email: '',
                        message: '',
                        query_type: ''
                    });
                },
                (error) => {
                    console.log('FAILED...', error.text);
                },
            );
    };

    const teamMembers = [
        {
            name: "Sarah Johnson",
            role: "CEO & Founder",
            description: "Former educator with 15 years of experience in EdTech",
            image: "/path/to/sarah.jpg" // Add actual image path
        },
        {
            name: "Michael Chen",
            role: "CTO",
            description: "AI specialist with focus on educational technology",
            image: "/path/to/michael.jpg" // Add actual image path
        },
        {
            name: "Emily Rodriguez",
            role: "Head of Product",
            description: "UX expert specializing in educational software",
            image: "/path/to/emily.jpg" // Add actual image path
        }
    ];

    // Query types for the dropdown
    const queryTypes = [
        { value: "", label: "Select Query Type" },
        { value: "general", label: "General Inquiry" },
        { value: "support", label: "Technical Support" },
        { value: "feedback", label: "Product Feedback" },
        { value: "partnership", label: "Partnership Opportunity" },
        { value: "pricing", label: "Pricing Information" },
        { value: "account", label: "Account Issues" }
    ];

    return (
        <div className="max-w-6xl mx-auto p-8 space-y-16">
            {/* About Section */}
            <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h2 className="text-3xl font-bold mb-6">About EduAssess</h2>
                <p className="text-gray-600 max-w-3xl mx-auto">
                    EduAssess is revolutionizing the way educators evaluate student performance. Our
                    platform combines cutting-edge technology with pedagogical expertise to deliver
                    comprehensive assessment solutions that help teachers save time and students achieve
                    more. We believe in making education more efficient, effective, and accessible for
                    everyone.
                </p>
            </motion.div>

            {/* Team Section */}
            <div className="space-y-8">
                <motion.h2
                    className="text-3xl font-bold text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    Meet Our Team
                </motion.h2>

                <motion.div
                    className="flex flex-wrap justify-center gap-8"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.2
                            }
                        }
                    }}
                >
                    {teamMembers.map((member, index) => (
                        <FounderCard key={index} {...member} />
                    ))}
                </motion.div>
            </div>

            {/* Contact Form */}
            <motion.div
                className="max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
            >
                <h2 className="text-3xl font-bold text-center mb-8">Get in Touch</h2>
                <form onSubmit={handleSubmit} ref={form} className="space-y-6">
                    <div>
                        <input
                            type="text"
                            placeholder="Name"
                            name='from_name'
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            name='user_email'
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    {/* Query Type Dropdown */}
                    <div>
                        <select
                            name="query_type"
                            value={formData.query_type}
                            onChange={(e) => setFormData({ ...formData, query_type: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
                            required
                        >
                            {queryTypes.map((type) => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <textarea
                            placeholder="Message"
                            value={formData.message}
                            name='message'
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            rows="4"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={rippleEffect}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 ripple-container"
                        type="submit"
                    >
                        Submit Message
                        <Send size={18} />
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
}