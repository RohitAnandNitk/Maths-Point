import React, { useEffect, useState } from "react";
import ExamCard from "../components/ExamCard";
import { motion, AnimatePresence } from "framer-motion";
import Loading from "../components/Loading";

const ExamPage = () => {

  const descrip = {
    mathematics: "Assesses problem-solving skills and mathematical concepts.",
    science: "Evaluates understanding of scientific principles and reasoning.",
    english:"Tests language skills, grammar, and comprehension abilities."
  }
  const [filters, setFilters] = useState({
    subject: [],
    questionType: "",
    timeLimit: "",
  });
  const [tests, setTests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tests from the database
  useEffect(() => {
    const fetchTests = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:5000/api/tests', {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch tests');
        }
        
        const data = await response.json();
        setTests(data.tests || []);
      } catch (error) {
        console.error('Error fetching tests:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTests();
  }, []);

  // Get unique subjects, question types, and durations from tests
  const subjects = [...new Set(tests.map(test => test.description))];
  const durations = [...new Set(tests.map(test => `${test.duration} min`))];

  // Filter tests based on selected filters
  const filteredTests = tests.filter((test) => {
    const subjectMatch =
      filters.subject.length === 0 || filters.subject.includes(test.description);
    const timeLimitMatch =
      !filters.timeLimit || `${test.duration} min` === filters.timeLimit;
    return subjectMatch && timeLimitMatch;
  });

  // Handle test deletion
  const handleTestDelete = async (testId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tests/${testId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete test');
      }
      
      // Update the tests list
      setTests(prev => prev.filter(test => test._id !== testId));
    } catch (error) {
      console.error('Error deleting test:', error);
      alert('Failed to delete test: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {isLoading ? (
        <Loading />
      ) : error ? (
        <div className="text-center text-red-500 py-8">
          Error loading tests: {error}
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Filters Section */}
            <div className="bg-white p-6 rounded-lg shadow-md h-fit">
              <h2 className="text-xl font-semibold mb-4">Filters</h2>

              <div className="space-y-4">
                {/* Subject Filter */}
                <div>
                  <h3 className="font-medium mb-2">Subject</h3>
                  {subjects.map((subject) => (
                    <div key={subject} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id={subject}
                        className="mr-2"
                        onChange={(e) => {
                          const newSubjects = e.target.checked
                            ? [...filters.subject, subject]
                            : filters.subject.filter((s) => s !== subject);
                          setFilters({ ...filters, subject: newSubjects });
                        }}
                      />
                      <label htmlFor={subject}>{subject}</label>
                    </div>
                  ))}
                </div>

                {/* Duration Filter */}
                <div>
                  <h3 className="font-medium mb-2">Duration</h3>
                  {durations.map((time) => (
                    <div key={time} className="flex items-center mb-2">
                      <input
                        type="radio"
                        id={time}
                        name="duration"
                        className="mr-2"
                        onChange={() => setFilters({ ...filters, timeLimit: time })}
                      />
                      <label htmlFor={time}>{time}</label>
                    </div>
                  ))}
                </div>

                {/* Reset Filters Button */}
                <button
                  className="w-full mt-4 bg-gray-100 text-gray-600 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
                  onClick={() =>
                    setFilters({ subject: [], questionType: "", timeLimit: "" })
                  }
                >
                  Reset Filters
                </button>
              </div>
            </div>

            {/* Exam Cards Section */}
            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredTests.length > 0 ? (
                  filteredTests.map((test) => (
                    <ExamCard 
                      key={test._id}
                      exam={{
                        id: test._id,
                        title: test.name,
                        subject: test.description,
                        timeLimit: `${test.duration} min`,
                        icon: "🎓",
                        description: `${descrip[test.description.toLowerCase()]}`,
                        // description: `${test.description} test created by ${test.creator?.fullname || 'Anonymous'}`,
                        createdAt: new Date(test.createdAt).toLocaleDateString()
                      }}
                      onDelete={() => handleTestDelete(test._id)}
                    />
                  ))
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="md:col-span-3 text-center py-8 text-gray-500"
                  >
                    No exams match your selected filters.
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamPage;
