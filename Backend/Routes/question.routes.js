const express = require('express');
const router = express.Router();
const Question = require('../Models/question');

const {addQuestion, deleteQuestion, updateQuestion} = require('../Controllers/question.controller');


router.get('/', async (req, res) => {
    try {
        const { testId } = req.query;
        
        let query = {};
        if (testId) {
            query.test_id = testId;
        }
        
        const questions = await Question.find(query);
        
        res.status(200).json({
            success: true,
            questions,
            message: "Questions retrieved successfully"
        });
    } catch (error) {
        console.error('Error getting questions:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
});

router.post('/:testId',addQuestion);


router.delete('/:testId/questions/:questionId',deleteQuestion);

router.put('/:testId/questions/:questionId',updateQuestion);

module.exports = router;