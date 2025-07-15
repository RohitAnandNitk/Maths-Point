import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

function CreateTest() {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([1]);
    const [selectedFiles, setSelectedFiles] = useState({});
    const [questionData, setQuestionData] = useState([{
        question: '',
        options: ['', '', '', ''],
        correct: '',
        duration: 0
    }]);
    const [isLoading, setIsLoading] = useState(false);
    const [userData, setUserData] = useState(null);
    
    // New state for test details
    const [testDetails, setTestDetails] = useState({
        title: '',
        subject: '',
        numberOfQuestions: '',
        questionType: '',
        timeLimit: ''
    });

    // Get user data from token when component mounts
    useEffect(() => {
        const token = Cookies.get('token');
        if(token) {
            try {
                const decoded = jwtDecode(token);
                setUserData(decoded);
            } catch (error) {
                console.error("Token decode error:", error);
                navigate('/signin'); // Redirect to signin if token is invalid
            }
        } else {
            navigate('/signin'); // Redirect to signin if no token
        }
    }, [navigate]);

    const addQuestion = () => {
        const newQuestionNumber = questions.length + 1;
        setQuestions([...questions, newQuestionNumber]);
        setQuestionData([...questionData, {
            question: '',
            options: ['', '', '', ''],
            correct: '',
            duration: 0
        }]);
    };

    const deleteQuestion = (questionNum) => {
        const questionIndex = questions.indexOf(questionNum);
        
        // Remove from questions array
        const newQuestions = questions.filter(q => q !== questionNum);
        setQuestions(newQuestions);
        
        // Remove from questionData array
        const newQuestionData = [...questionData];
        newQuestionData.splice(questionIndex, 1);
        setQuestionData(newQuestionData);
        
        // Remove from selectedFiles
        const newSelectedFiles = { ...selectedFiles };
        delete newSelectedFiles[questionNum];
        setSelectedFiles(newSelectedFiles);
    };

    const handleFileChange = (questionNum, e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFiles({
                ...selectedFiles,
                [questionNum]: file
            });
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (questionNum, e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            setSelectedFiles({
                ...selectedFiles,
                [questionNum]: file
            });
        }
    };

    const handleChange = (questionIndex, field, value, optionIndex = null) => {
        const updatedQuestionData = [...questionData];
        
        if (optionIndex !== null) {
            // Update an option
            const updatedOptions = [...updatedQuestionData[questionIndex].options];
            updatedOptions[optionIndex] = value;
            updatedQuestionData[questionIndex].options = updatedOptions;
        } else {
            // Update other fields (question, correct, duration)
            updatedQuestionData[questionIndex][field] = value;
        }
        
        setQuestionData(updatedQuestionData);
    };

    // Handler for test details input changes
    const handleDetailChange = (field, value) => {
        setTestDetails({
            ...testDetails,
            [field]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate test details
        if (!testDetails.title || !testDetails.subject || !testDetails.numberOfQuestions) {
            alert("Please fill in all required test details!");
            return;
        }

        // Validate user is logged in
        if (!userData || !userData.id) {
            alert("You must be logged in to create a test!");
            navigate('/signin');
            return;
        }

        setIsLoading(true);

        try {
            // Step 1: Create the test in the database
            const testResponse = await fetch('http://localhost:5000/api/tests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    name: testDetails.title,
                    description: testDetails.subject,
                    duration: parseInt(testDetails.timeLimit) || 60,
                    userId: userData.id
                })
            });

            const testData = await testResponse.json();
            
            if (!testResponse.ok) {
                throw new Error(testData.message || 'Failed to create test');
            }

            console.log('Test created successfully:', testData);
            const testId = testData.test._id;

            // Step 2: Add questions to the test
            for (let i = 0; i < questionData.length; i++) {
                const question = questionData[i];
                
                // Skip empty questions
                if (!question.question.trim()) continue;
                
                const questionResponse = await fetch(`http://localhost:5000/api/questions/${testId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        text: question.question,
                        type: testDetails.questionType || 'objective',
                        options: question.options,
                        correct_option: question.correct
                    })
                });

                const questionResult = await questionResponse.json();
                
                if (!questionResponse.ok) {
                    console.error('Failed to add question:', questionResult);
                    // Continue with other questions even if one fails
                }
            }

            // Clear form after successful submission
            setTestDetails({
                title: '',
                subject: '',
                numberOfQuestions: '',
                questionType: '',
                timeLimit: ''
            });
            setQuestionData([{
                question: '',
                options: ['', '', '', ''],
                correct: '',
                duration: 0
            }]);
            setQuestions([1]);
            setSelectedFiles({});

            alert("Test and questions saved successfully!");
            
        } catch (error) {
            console.error('Error saving test:', error);
            alert(`Failed to save test: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-screen-xl mx-auto p-6"
        >
            <motion.h2
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                className="text-2xl font-bold mb-6"
            >
                Create New Test
            </motion.h2>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    <p className="ml-3 text-lg text-gray-700">Saving test...</p>
                </div>
            ) : (
                <>
                    {/* Test Details Section */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="bg-white rounded-lg shadow p-6 mb-6"
                    >
                        <div className="space-y-4">
                            {/* Test Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Test Title</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded-md"
                                    placeholder="Enter test title"
                                    value={testDetails.title}
                                    onChange={(e) => handleDetailChange('title', e.target.value)}
                                    required
                                />
                            </div>

                            {/* Subject and Number of Questions */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject/Category</label>
                                    <select 
                                        className="w-full p-2 border rounded-md"
                                        value={testDetails.subject}
                                        onChange={(e) => handleDetailChange('subject', e.target.value)}
                                        required
                                    >
                                        <option value="">Select subject</option>
                                        <option value="mathematics">Mathematics</option>
                                        <option value="science">Science</option>
                                        <option value="english">English</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Number of Questions</label>
                                    <input
                                        type="number"
                                        min={1}
                                        className="w-full p-2 border rounded-md"
                                        placeholder="Enter number of questions"
                                        value={testDetails.numberOfQuestions}
                                        onChange={(e) => handleDetailChange('numberOfQuestions', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Question Type and Time Limit */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Question Type</label>
                                    <select 
                                        className="w-full p-2 border rounded-md"
                                        value={testDetails.questionType}
                                        onChange={(e) => handleDetailChange('questionType', e.target.value)}
                                        required
                                    >
                                        <option value="">Select type</option>
                                        <option value="objective">Objective</option>
                                        <option value="subjective">Subjective</option>
                                        <option value="both">Both</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Time Limit (minutes)</label>
                                    <input
                                        type="number"
                                        min={1}
                                        className="w-full p-2 border rounded-md"
                                        placeholder="Enter time limit"
                                        value={testDetails.timeLimit}
                                        onChange={(e) => handleDetailChange('timeLimit', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Questions Section */}
                    <AnimatePresence>
                        {questions.map((questionNum, index) => (
                            <motion.div
                                key={questionNum}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white rounded-lg shadow p-6 mb-6"
                            >
                                {/* Question content */}
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold">Question {questionNum}</h3>
                                    <button
                                        onClick={() => deleteQuestion(questionNum)}
                                        className="text-red-600 hover:text-red-800 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Question Text */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Question Text</label>
                                    <textarea
                                        value={questionData[index]?.question || ''}
                                        onChange={(e) => handleChange(index, 'question', e.target.value)}
                                        className="w-full p-2 border rounded-md"
                                        rows="4"
                                        placeholder="Enter your question"
                                        required
                                    />
                                </div>

                                {/* Options */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Option A</label>
                                        <input 
                                            type="text" 
                                            className="w-full p-2 border rounded-md" 
                                            value={questionData[index]?.options[0] || ''}
                                            onChange={(e) => handleChange(index, 'options', e.target.value, 0)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Option B</label>
                                        <input 
                                            type="text" 
                                            className="w-full p-2 border rounded-md" 
                                            value={questionData[index]?.options[1] || ''}
                                            onChange={(e) => handleChange(index, 'options', e.target.value, 1)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Option C</label>
                                        <input 
                                            type="text" 
                                            className="w-full p-2 border rounded-md" 
                                            value={questionData[index]?.options[2] || ''}
                                            onChange={(e) => handleChange(index, 'options', e.target.value, 2)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Option D</label>
                                        <input 
                                            type="text" 
                                            className="w-full p-2 border rounded-md" 
                                            value={questionData[index]?.options[3] || ''}
                                            onChange={(e) => handleChange(index, 'options', e.target.value, 3)}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Correct Answer and Duration */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Correct Answer</label>
                                        <input 
                                            className="w-full p-2 border rounded-md"
                                            value={questionData[index]?.correct || ''}
                                            onChange={(e) => handleChange(index, 'correct', e.target.value)}
                                            required
                                        />
                                            
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                                        <input
                                            type="number"
                                            min={1}
                                            className="w-full p-2 border rounded-md"
                                            placeholder="Enter duration"
                                            value={questionData[index]?.duration || 0}
                                            onChange={(e) => handleChange(index, 'duration', parseInt(e.target.value) || 0)}
                                        />
                                    </div>
                                </div>

                                {/* Image Upload */}
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Upload Image (optional)
                                    </label>
                                    <div
                                        className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center relative"
                                        onDragOver={handleDragOver}
                                        onDrop={(e) => handleDrop(questionNum, e)}
                                    >
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(questionNum, e)}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        <div className="text-gray-600">
                                            {selectedFiles[questionNum] ? (
                                                <div className="flex items-center justify-center">
                                                    <img
                                                        src={URL.createObjectURL(selectedFiles[questionNum])}
                                                        alt="Preview"
                                                        className="max-h-20 object-contain mr-2"
                                                    />
                                                    <span>{selectedFiles[questionNum].name}</span>
                                                </div>
                                            ) : (
                                                "Click to upload or drag and drop"
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Add Question Button */}
                    <motion.div
                        className="flex justify-between items-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={addQuestion}
                            className="flex items-center text-blue-600 hover:text-blue-800"
                        >
                            <Plus className="w-5 h-5 mr-1" />
                            Add Question
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                            onClick={handleSubmit}
                        >
                            Save Test
                        </motion.button>
                    </motion.div>
                </>
            )}
        </motion.div>
    );
}

export default CreateTest;