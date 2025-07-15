import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import TestimonialCard from "../components/TestimonialCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';
import {useNavigate} from 'react-router-dom';

function Testimonial() {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    occupation: "Student",
    testimonial: "",
  });
  
  // Get user data from token when component mounts
  useEffect(() => {
    const token = Cookies.get('token');
    if(token) {
      try {
        const decoded = jwtDecode(token);
        setUserData(decoded);
        // Set the fullName from token data
        setFormData(prev => ({
          ...prev,
          fullName: decoded.fullname || ""
        }));
      } catch (error) {
        console.error("Token decode error:", error);
      }
    }
  }, []);

  const [testimonials, setTestimonials] = useState([]); 
  const [error, setError] = useState(false);

  // Fetch testimonials from backend
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/testimonials", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        const data = await response.json();
        if (response.ok) {
          setTestimonials(data.testimonials);
        } else {
          console.error("Failed to fetch testimonials:", data.message);
        }
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      }
    };

    fetchTestimonials();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/testimonials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          user_id: userData?.id, // Use the ID from decoded token
          content: formData.testimonial,
          rating,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Testimonial submitted:", data);
        window.location.reload();
      } else {
        setError(true);
        console.error("Submission failed:", data.message);
      }
    } catch (error) {
      setError(true);
      console.error("Submission error:", error);
    }
  };

  return (
    <div className="py-16 flex flex-col items-center justify-center relative">
      {/* Testimonial Form Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl mx-auto mb-20 px-4"
      >
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-2">
            SUBMIT YOUR TESTIMONIAL
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Share your experience with EduAssess to help us improve
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                disabled={userData !== null} 
                required
              />
            </div>

            <div>
              <label
                htmlFor="occupation"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Occupation
              </label>
              <input
                type="text"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="testimonial"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Your Testimonial
              </label>
              <textarea
                name="testimonial"
                value={formData.testimonial}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="text-2xl focus:outline-none"
                  >
                    {star <= rating ? "⭐" : "☆"}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              Submit Testimonial
            </button>
          </form>
        </div>
      </motion.div>

      {/* Testimonials display section */}
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h2 className="font-bold text-3xl mb-3">What Our Students Say</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover how EduAssess has helped thousands of students achieve their
          academic goals.
        </p>
      </motion.div>

      {/* Swiper Slideshow */}
      <div className="w-full max-w-7xl px-12">
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          navigation
          speed={600}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="testimonial-swiper"
        >
          {testimonials.map((entry, index) => (
            <SwiperSlide key={index}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.4, 
                  delay: index * 0.1,
                  ease: "easeInOut",
                }}
                className="px-2 py-3"
              >
                <TestimonialCard
                  fullName={entry.user_id?.fullname || "Anonymous"}
                  occupation={formData.occupation}
                  testimonial={entry.content}
                  rating={entry.rating}
                />
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default Testimonial;
