import React from 'react';
import { motion } from 'framer-motion';
import logo from '../assets/avatar.png'


function FounderCard({ name, role, description, image }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-lg p-6 text-center max-w-sm"
    >
      <motion.img 
        src={logo} 
        alt={name} 
        className="w-24 h-24 mx-auto rounded-full mb-4 object-cover"
        whileHover={{ scale: 1.05 }}
      />
      <h3 className="font-semibold text-lg mb-1">{name}</h3>
      <p className="text-blue-600 font-medium mb-2">{role}</p>
      <p className="text-gray-600 text-sm">{description}</p>
    </motion.div>
  );
}

export default FounderCard;
