import React from "react";
import { motion } from "framer-motion";

function PricingCard({ nature, price, features, popular }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`w-72 p-6 rounded-xl ${
        popular ? 'bg-blue-50' : 'bg-white'
      } shadow-md hover:shadow-xl transition-all duration-300`}
    >
      {popular && (
        <div className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full w-fit mb-4">
          Popular
        </div>
      )}
      
      {/* Plan Name and Price */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">{nature}</h3>
        <div className="flex items-baseline">
          <span className="text-3xl font-bold">${price}</span>
          <span className="text-gray-600 ml-1">/month</span>
        </div>
      </div>

      {/* Features List */}
      <ul className="space-y-3 mb-6">
        {features?.map((feature, index) => (
          <li key={index} className="flex items-center text-gray-600">
            <svg 
              className="w-4 h-4 mr-2 text-green-500" 
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7"
              />
            </svg>
            {feature}
          </li>
        ))}
      </ul>

      {/* Choose Plan Button */}
      <button
        className={`w-full py-2 px-4 rounded-md font-medium transition-colors duration-300 ${
          popular
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        Choose Plan
      </button>
    </motion.div>
  );
}

export default PricingCard;
