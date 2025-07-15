import React, { useState } from "react";
import PricingCard from "../components/PricingCard";
import { motion } from "framer-motion";
import { rippleEffect } from "../utils/rippleEffect";


function Pricing() {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      question: "What's included in Premium?",
      answer: "Premium includes all Basic features plus personalized study plans, 1-on-1 mentoring sessions, and priority customer support."
    },
    {
      question: "Can I switch plans?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle."
    },
    {
      question: "Is there a refund policy?",
      answer: "We offer a 30-day money-back guarantee if you're not satisfied with our premium services."
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  const fadeInUp = {
    hidden: { y: 40, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { duration: 0.6, ease: "easeOut" } 
    }
  };
  
  return (
    <motion.div 
      className="max-w-7xl mx-auto px-4 py-16"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div 
        className="text-center mb-16"
        variants={fadeInUp}
      >
        <h1 className="text-3xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-gray-600">
          Select the perfect plan for your educational assessment needs
        </p>
      </motion.div>

      {/* Pricing Cards */}
      <motion.div 
        className="flex flex-wrap justify-center gap-8 mb-20"
        variants={containerVariants}
      >
        {[
          {
            nature: "Free",
            price: "0",
            features: [
              "Basic practice tests",
              "Limited question bank",
              "Basic performance reports",
            ]
          },
          {
            nature: "Basic",
            price: "10",
            features: [
              "All Free features",
              "Advanced practice tests",
              "Detailed analytics",
              "Progress tracking",
            ]
          },
          {
            nature: "Premium",
            price: "20",
            features: [
              "All Basic features",
              "Personalized study plans",
              "1-on-1 mentoring",
              "Priority support",
            ],
            popular: true
          }
        ].map((plan, index) => (
          <motion.div key={index} variants={itemVariants} className="w-full md:w-auto">
            <PricingCard {...plan} />
          </motion.div>
        ))}
      </motion.div>

      {/* FAQ Section */}
      <motion.div 
        className="max-w-3xl mx-auto"
        variants={fadeInUp}
      >
        <h2 className="text-2xl font-bold text-center mb-8">
          Frequently Asked Questions
        </h2>
        <motion.div 
          className="space-y-4"
          variants={containerVariants}
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden"
              initial={false}
              variants={itemVariants}
            >
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center bg-white"
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              >
                <span className="font-medium">{faq.question}</span>
                <svg
                  className={`w-5 h-5 transform transition-transform ${
                    openFaq === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <motion.div
                initial={false}
                animate={{
                  height: openFaq === index ? "auto" : 0,
                  opacity: openFaq === index ? 1 : 0
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden bg-gray-50"
              >
                <p className="px-6 py-4 text-gray-600">
                  {faq.answer}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default Pricing;