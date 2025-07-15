const express = require('express');
const router = express.Router();

const {
    getTests,
    createTest,
    getTestById,
    updateTest,
    deleteTest
} = require('../Controllers/test.controller');

console.log('Test routes loaded');

// Get all tests
router.get('/', getTests);


// Get a single test by ID
router.get('/:id', getTestById);

// Create a new test
router.post('/', createTest);

// Update a test
router.put('/:id', updateTest);

// Delete a test
router.delete('/:id', deleteTest);

module.exports = router;
