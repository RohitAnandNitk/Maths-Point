import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

import config from "../config";
const BaseURL = config.BASE_URL;

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentResult, setCurrentResult] = useState(null);
  const [previousResults, setPreviousResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch(`${BaseURL}/attempt/get-all-attempts`, {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch attempts");
        }

        const data = await res.json();
        const attempts = data.attempts || [];
        console.log("All attempts", attempts);

        const currentExamId = location.state?.examId;
        console.log("current exam id :", currentExamId);
        let current = null;

        if (currentExamId) {
          current = attempts.find(
            (a) => String(a.test_id._id) === String(currentExamId)
          );
        }

        if (!current && attempts.length > 0) {
          current = attempts[0];
        }

        console.log("current result :", current.test_id.name);
        setCurrentResult(current);

        const previous = attempts
          .filter((a) => String(a.test_id) !== String(currentExamId))
          .slice(0, 6)
          .map((a) => ({
            examTitle: a.test_id?.name || "Unnamed Test",
            date: a.completed_at || a.createdAt,
            percentage: (a.score / a.answers.length) * 100 || 0,
          }));

        setPreviousResults(previous);
      } catch (err) {
        console.error("Error fetching results:", err);
      }
    };

    fetchResults();
  }, [location]);

  if (!currentResult) {
    return (
      <div className="text-center text-xl">Loading or no result found</div>
    );
  }

  const totalQuestions = currentResult.answers.length;
  const correctAnswers = currentResult.score || 0;
  const incorrectAnswers = currentResult.answers.filter(
    (a) => !a.is_correct
  ).length;
  const unansweredQuestions = 0; // because `selected_option` is always required per schema

  const percentage = ((correctAnswers / totalQuestions) * 100).toFixed(1);

  const examTitle = currentResult.test_id?.name || "Unnamed Test";
  const timeTaken = currentResult.duration_seconds || 0;

  const questions = currentResult.answers.map((a, index) => ({
    number: index + 1,
    status: a.is_correct ? "correct" : "incorrect",
    userAnswer: a.selected_option || "N/A",
    correctAnswer: a.question_id?.correct_option || "N/A",
    questionText: a.question_id?.text || "Question text not available",
  }));

  const pieData = [
    { name: "Correct", value: correctAnswers, color: "#3B82F6" },
    { name: "Incorrect", value: incorrectAnswers, color: "#EF4444" },
    { name: "Unanswered", value: unansweredQuestions, color: "#6B7280" },
  ];

  const barData = [
    { section: "Correct", score: correctAnswers },
    { section: "Incorrect", score: incorrectAnswers },
    { section: "Unanswered", score: unansweredQuestions },
  ];

  const lineData = previousResults
    .filter((r) => r.date && r.percentage !== undefined)
    .map((r) => ({
      date: new Date(r.date).toLocaleDateString(),
      score: r.percentage,
    }));

  const handleTakeAnotherTest = () => {
    navigate("/exam");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full py-8">
      <div className="container mx-auto px-4">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Sidebar - Previous Tests */}
          <motion.div
            className="lg:col-span-1 bg-white rounded-xl shadow-lg p-6"
            variants={itemVariants}
          >
            <h3 className="text-xl font-bold mb-6 text-gray-800">
              Previous Tests
            </h3>
            <div className="space-y-4">
              {previousResults.length > 0 ? (
                previousResults.map((result, index) => (
                  <motion.div
                    key={index}
                    className="bg-gray-50 p-4 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer border border-gray-100"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="font-semibold text-gray-800">
                      {result.examTitle}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {new Date(result.date).toLocaleDateString()}
                    </div>
                    <div className="text-sm font-bold text-blue-600 mt-2">
                      {result.percentage.toFixed(1)}%
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-gray-500 text-center py-4">
                  No previous tests
                </div>
              )}
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            className="lg:col-span-3 bg-white rounded-xl shadow-lg p-8"
            variants={itemVariants}
          >
            {/* Summary */}
            <motion.div className="mb-8" variants={itemVariants}>
              <h1 className="text-3xl font-bold mb-6 text-gray-800">
                {examTitle}
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-600 text-white p-6 rounded-xl shadow-md">
                  <div className="text-2xl font-bold">
                    {correctAnswers}/{totalQuestions}
                  </div>
                  <div className="text-sm opacity-90">Total Score</div>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl shadow-md">
                  <div className="text-2xl font-bold text-blue-600">
                    {percentage}%
                  </div>
                  <div className="text-sm text-gray-600">Percentage</div>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl shadow-md">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.floor(timeTaken / 60)} mins
                  </div>
                  <div className="text-sm text-gray-600">Time Taken</div>
                </div>
              </div>
            </motion.div>

            {/* Charts */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
              variants={itemVariants}
            >
              <div className="bg-gray-50 rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Question Distribution
                </h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((e, i) => (
                          <Cell key={`cell-${i}`} fill={e.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Performance Breakdown
                </h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="section" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="score" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Recent Performance
                </h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="score" stroke="#3B82F6" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>

            {/* Question Breakdown */}
            <motion.div className="mb-8" variants={itemVariants}>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Detailed Question Breakdown
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border p-3 text-left">#</th>
                      <th className="border p-3 text-left">Question</th>
                      <th className="border p-3 text-left">Status</th>
                      <th className="border p-3 text-left">Your Answer</th>
                      <th className="border p-3 text-left">Correct Answer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {questions.map((q) => (
                      <tr key={q.number} className="hover:bg-gray-50">
                        <td className="border p-3">{q.number}</td>
                        <td className="border p-3">{q.questionText}</td>
                        <td
                          className={`border p-3 font-semibold ${
                            q.status === "correct"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {q.status.charAt(0).toUpperCase() + q.status.slice(1)}
                        </td>
                        <td className="border p-3">{q.userAnswer}</td>
                        <td className="border p-3">{q.correctAnswer}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            <motion.div
              className="flex justify-center space-x-4"
              variants={itemVariants}
            >
              <button
                onClick={() =>
                  navigate(`/test?examId=${currentResult.test_id._id}`)
                }
                className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
              >
                Retake Test
              </button>
              <button
                onClick={handleTakeAnotherTest}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Take Another Test
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Result;
