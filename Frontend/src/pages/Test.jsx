import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";

import config from "../config";
const BaseURL = config.BASE_URL;

const Test = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [answeredQuestions, setAnsweredQuestions] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [testData, setTestData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch test and questions data
  useEffect(() => {
    const fetchTestData = async () => {
      try {
        setIsLoading(true);
        const testId = localStorage.getItem("currentExamId");

        if (!testId) {
          throw new Error("No test selected");
        }

        // Fetch test details
        const testResponse = await fetch(`${BaseURL}/api/tests/${testId}`, {
          credentials: "include",
        });

        if (!testResponse.ok) {
          throw new Error("Failed to fetch test details");
        }

        const testData = await testResponse.json();
        setTestData(testData.test);

        // Set timer based on test duration
        setTimeRemaining(testData.test.duration * 60); // Convert minutes to seconds

        // Fetch questions for this test
        const questionsResponse = await fetch(
          `${BaseURL}/api/questions?testId=${testId}`,
          {
            credentials: "include",
          }
        );

        if (!questionsResponse.ok) {
          throw new Error("Failed to fetch questions");
        }

        const questionsData = await questionsResponse.json();

        // Format questions for the test interface
        const formattedQuestions = questionsData.questions.map((q, index) => ({
          id: q._id,
          number: index + 1,
          type: q.type,
          question: q.text,
          options: q.options,
          correctAnswer: q.correct_option,
        }));

        setQuestions(formattedQuestions);
      } catch (error) {
        console.error("Error fetching test data:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestData();
  }, []);

  // Timer logic
  useEffect(() => {
    if (timeRemaining <= 0 || isLoading) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest(); // Auto-submit when time runs out
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, isLoading]);

  // Format time remaining
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Handle navigation with animations
  const handlePrevious = () => {
    if (currentQuestion > 1 && !isAnimating) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentQuestion(currentQuestion - 1);
        setSelectedAnswer(answeredQuestions[currentQuestion - 1] || "");
        setIsAnimating(false);
      }, 300);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length && !isAnimating) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(answeredQuestions[currentQuestion + 1] || "");
        setIsAnimating(false);
      }, 300);
    }
  };

  const handleSubmitTest = async () => {
    try {
      const totalQuestions = questions.length;
      let correctAnswers = 0;
      let incorrectAnswers = 0;
      let unansweredQuestions = 0;

      const answersForBackend = [];

      // build answers and stats
      questions.forEach((question) => {
        const userAnswer = answeredQuestions[question.number];

        if (!userAnswer) {
          unansweredQuestions++;
        } else if (userAnswer === question.correctAnswer) {
          correctAnswers++;
        } else {
          incorrectAnswers++;
        }

        answersForBackend.push({
          question_id: question.id, // ✅ fixed: use .id
          selected_option: userAnswer || null,
        });
      });

      const timeTakenSeconds = testData.duration * 60 - timeRemaining;

      const payload = {
        test_id: testData._id,
        answers: answersForBackend,
        time_taken: timeTakenSeconds, // optional if backend expects
      };

      // 🧪 debug logs
      console.log("✅ Submitting test with payload:", payload);
      console.table(answersForBackend);

      const res = await fetch(`${BaseURL}/attempt/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errMsg = await res.text();
        console.error("❌ Failed to save attempt:", errMsg);
        alert("Failed to save attempt. Please try again.");
        return;
      }

      const data = await res.json();

      console.log("✅ Attempt saved successfully:", data);

      // Navigate to results page
      navigate("/results", {
        state: {
          examId: testData._id,
          attemptId: data.attempt._id,
        },
      });
    } catch (err) {
      console.error("❌ Error submitting test:", err);
      alert("Something went wrong while submitting the test.");
    }
  };

  // Update this function to track answered questions
  const handleAnswerSelection = (option) => {
    setSelectedAnswer(option);
    setAnsweredQuestions({
      ...answeredQuestions,
      [currentQuestion]: option,
    });
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => navigate("/exam")}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Back to Exams
          </button>
        </div>
      </div>
    );
  }

  // Get current question
  const currentQuestionData = questions[currentQuestion - 1];
  if (!currentQuestionData) {
    return (
      <div className="text-center py-8">
        No questions available for this test.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 select-none">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left sidebar with question numbers */}
          <div className="w-full md:w-56 bg-gray-50 p-4 border-r border-gray-200">
            <h3 className="font-medium mb-4">Questions</h3>
            <div className="grid grid-cols-5 gap-3 ">
              {questions.map((question) => {
                const questionNumber = question.number;
                const isCurrentQuestion = questionNumber === currentQuestion;
                const isAnswered = answeredQuestions[questionNumber];

                return (
                  <button
                    key={question.id}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 transform hover:scale-110 ${
                      isCurrentQuestion
                        ? "bg-blue-600 text-white shadow-md" // Current question - Blue
                        : isAnswered
                        ? "bg-green-500 text-white" // Answered question - Green
                        : "bg-white border border-gray-300 text-gray-700" // Unanswered question
                    }`}
                    onClick={() => {
                      if (!isAnimating) {
                        setIsAnimating(true);
                        setTimeout(() => {
                          setCurrentQuestion(questionNumber);
                          setSelectedAnswer(
                            answeredQuestions[questionNumber] || ""
                          );
                          setIsAnimating(false);
                        }, 300);
                      }
                    }}
                  >
                    {questionNumber}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main content area */}
          <div className="flex-1 p-6">
            {/* Test title and timer */}
            <div className="flex justify-between items-center bg-blue-50 p-4 rounded-lg mb-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-800">
                {testData?.name}
              </h2>
              <div className="flex items-center">
                <span className="text-gray-700 font-medium mr-2">
                  Time Remaining:
                </span>
                <span className="text-blue-600 font-bold text-xl">
                  {formatTime(timeRemaining)}
                </span>
              </div>
            </div>

            <div
              className={`transition-all duration-300 transform ${
                isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
              }`}
            >
              {/* Question */}
              <div className="mb-8 animate-fadeIn">
                <p className="text-gray-600 mb-2">
                  Question {currentQuestion} of {questions.length}
                </p>
                <h2 className="text-xl font-medium">
                  {currentQuestionData.question}
                </h2>
              </div>

              {/* Options with increased spacing */}
              <div className="space-y-4 mb-10">
                {currentQuestionData.options.map((option, index) => (
                  <div
                    key={index}
                    className={`border border-gray-200 rounded-lg hover:border-blue-400 transition-all duration-200 transform ${
                      selectedAnswer === option
                        ? "border-blue-500 bg-blue-50 scale-102"
                        : ""
                    } shadow-sm hover:shadow`}
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: "fadeInUp 0.5s ease forwards",
                    }}
                  >
                    <label className="flex items-center p-4 cursor-pointer w-full">
                      <input
                        type="radio"
                        name="answer"
                        value={option}
                        checked={selectedAnswer === option}
                        onChange={() => handleAnswerSelection(option)}
                        className="mr-4 h-5 w-5 text-blue-600"
                      />
                      <span className="text-lg">{option}</span>
                    </label>
                  </div>
                ))}
              </div>

              {/* Navigation buttons */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestion === 1 || isAnimating}
                  className={`flex items-center px-6 py-2 rounded-lg transition-all duration-200 ${
                    currentQuestion === 1 || isAnimating
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  ← Previous
                </button>

                <button
                  onClick={handleSubmitTest}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg transition-all duration-200 hover:bg-green-700 shadow-sm"
                >
                  Submit Test
                </button>

                <button
                  onClick={handleNext}
                  disabled={currentQuestion === questions.length || isAnimating}
                  className={`flex items-center px-6 py-2 rounded-lg transition-all duration-200 ${
                    currentQuestion === questions.length || isAnimating
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for animations and preventing text selection */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.4s ease-in;
        }

        .scale-102 {
          transform: scale(1.02);
        }

        /* Disable text selection globally for this component */
        * {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }

        /* Disable context menu */
        body {
          -webkit-touch-callout: none;
        }
      `}</style>
    </div>
  );
};

export default Test;
