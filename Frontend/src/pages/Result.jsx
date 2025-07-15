import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PieChart, Pie, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentResult, setCurrentResult] = useState(null);
  const [previousResults, setPreviousResults] = useState([]);

  useEffect(() => {
    // Get all results
    const allResults = JSON.parse(localStorage.getItem('examResults')) || [];
    
    // Get current result
    const currentExamId = location.state?.examId;
    if(currentExamId) {
      console.log("Current exam ID:", currentExamId);
    }
    
    const current = allResults.find(r => r.examId === currentExamId);
    setCurrentResult(current);

    // Get previous results (excluding current)
    const previous_result = allResults.filter(r => r.examId !== currentExamId);
    
    // Filter out any undefined or null values and limit to 6 results
    const validPreviousResults = previous_result
      .filter(result => result && result.date) // Make sure result exists and has a date
      .slice(0, 6); // Take only the first 6 results
      
    setPreviousResults(validPreviousResults);
  }, [location]);

  if (!currentResult) {
    return <div className='flex justify-center text-center font-bold text-3xl'>No test yet.</div>;
  }

  // Prepare data for charts
  const pieData = [
    { name: 'Correct', value: currentResult.correctAnswers, color: '#3B82F6' },
    { name: 'Incorrect', value: currentResult.incorrectAnswers, color: '#EF4444' },
    { name: 'Unanswered', value: currentResult.unansweredQuestions, color: '#6B7280' }
  ];

  const barData = [
    { section: 'Correct', score: currentResult.correctAnswers },
    { section: 'Incorrect', score: currentResult.incorrectAnswers },
    { section: 'Unanswered', score: currentResult.unansweredQuestions }
  ];

  // Safely create lineData, ensuring we only map over valid results
  const lineData = previousResults
    .filter(result => result && result.date && result.percentage !== undefined)
    .slice(-5)
    .map(result => ({
      date: new Date(result.date).toLocaleDateString(),
      score: result.percentage
    }));

  const handleTakeAnotherTest = () => {
    navigate('/exam');
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
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
          {/* Sidebar with Previous Tests */}
          <motion.div 
            className="lg:col-span-1 bg-white rounded-xl shadow-lg p-6"
            variants={itemVariants}
          >
            <h3 className="text-xl font-bold mb-6 text-gray-800">Previous Tests</h3>
            <div className="space-y-4">
              {previousResults.length > 0 ? (
                previousResults.map((result, index) => (
                  <motion.div 
                    key={index} 
                    className="bg-gray-50 p-4 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer border border-gray-100"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="font-semibold text-gray-800">{result.examTitle || "Unnamed Test"}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      {new Date(result.date).toLocaleDateString()}
                    </div>
                    <div className="text-sm font-bold text-blue-600 mt-2">
                      {result.percentage.toFixed(1)}%
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-gray-500 text-center py-4">No previous tests</div>
              )}
            </div>
          </motion.div>

          {/* Main Result Section */}
          <motion.div 
            className="lg:col-span-3 bg-white rounded-xl shadow-lg p-8"
            variants={itemVariants}
          >
            {/* Result Summary */}
            <motion.div 
              className="mb-8"
              variants={itemVariants}
            >
              <h1 className="text-3xl font-bold mb-6 text-gray-800">{currentResult.examTitle}</h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-600 text-white p-6 rounded-xl shadow-md">
                  <div className="text-2xl font-bold">
                    {currentResult.correctAnswers}/{currentResult.totalQuestions}
                  </div>
                  <div className="text-sm opacity-90">Total Score</div>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl shadow-md">
                  <div className="text-2xl font-bold text-blue-600">
                    {currentResult.percentage.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Percentage</div>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl shadow-md">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.floor(currentResult.timeTaken / 60)} mins
                  </div>
                  <div className="text-sm text-gray-600">Time Taken</div>
                </div>
              </div>
            </motion.div>

            {/* Charts Section */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
              variants={itemVariants}
            >
              {/* Pie Chart */}
              <div className="bg-gray-50 rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Question Distribution</h3>
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
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bar Chart */}
              <div className="bg-gray-50 rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Performance Breakdown</h3>
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

              {/* Line Chart */}
              <div className="bg-gray-50 rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Recent Performance</h3>
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
            <motion.div 
              className="mb-8"
              variants={itemVariants}
            >
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Detailed Question Breakdown</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border p-3 text-left">Question No.</th>
                      <th className="border p-3 text-left">Status</th>
                      <th className="border p-3 text-left">Your Answer</th>
                      <th className="border p-3 text-left">Correct Answer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentResult.questions.map((question) => (
                      <tr key={question.number} className="hover:bg-gray-50">
                        <td className="border p-3">{question.number}</td>
                        <td className={`border p-3 font-semibold ${
                          question.status === 'correct' ? 'text-green-600' : 
                          question.status === 'incorrect' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {question.status.charAt(0).toUpperCase() + question.status.slice(1)}
                        </td>
                        <td className="border p-3">{question.userAnswer}</td>
                        <td className="border p-3">{question.correctAnswer}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              className="flex justify-center space-x-4"
              variants={itemVariants}
            >
              <button 
                onClick={() => navigate(`/test?examId=${currentResult.examId}`)}
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