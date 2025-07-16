import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../utils/rippleEffect";
import { Trash2 } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

const ExamCard = ({ exam, onDelete }) => {
  const navigate = useNavigate();
  const [isTeacher, setIsTeacher] = useState(false);

  const handleStartExam = () => {
    localStorage.setItem("currentExamId", exam.id);
    navigate("/test");
  };

  // fetch the user type
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.role === "teacher") {
          setIsTeacher(true);
        } else {
          setIsTeacher(false);
        }
      } catch (error) {
        setIsTeacher(false);
        console.error("Token decode error:", error);
      }
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow 
                 max-h-[350px] min-h-[250px] flex flex-col justify-between relative group"
    >
      {/* Delete button overlay (only if teacher) */}
      {isTeacher && (
        <button
          onClick={() => onDelete(exam.id)}
          className="absolute top-2 right-2 p-2 text-gray-400 hover:text-red-500 
                   opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          title="Delete exam"
        >
          <Trash2 size={20} />
        </button>
      )}

      <div>
        <div className="flex items-center mb-4">
          <span className="text-3xl mr-3">{exam.icon}</span>
          <div>
            <h3 className="text-2xl font-bold">{exam.title}</h3>
            <p className="text-gray-500 mb-2 text-xl italic">{exam.subject}</p>
          </div>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-3">{exam.description}</p>

        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-500">⏱️ {exam.timeLimit}</span>
          <span className="text-gray-500">📅 {exam.createdAt}</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          className="ripple-container bg-blue-500 text-white py-1.5 px-4 rounded-md 
                     hover:bg-blue-600 transition-colors flex-1 text-sm font-medium"
          onClick={handleStartExam}
        >
          Start Exam
        </button>

        {/* Bottom delete button (only if teacher) */}
        {isTeacher && (
          <button
            className="ripple-container bg-red-500 text-white py-1.5 px-4 rounded-md 
                     hover:bg-red-600 transition-colors flex-1 text-sm font-medium"
            onClick={() => onDelete(exam.id)}
          >
            Delete
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default ExamCard;
