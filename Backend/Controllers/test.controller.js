const Test = require('../Models/test');

// Get all tests
async function getTests(req, res) {
    try {
        const tests = await Test.find().populate('creator', 'fullname email');
        res.status(200).json({
            success: true,
            tests
        });
    } catch (error) {
        console.error('Error fetching tests:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching tests',
            error: error.message
        });
    }
}

// Create a new test
async function createTest(req, res) {
    try {
        console.log('Received request body:', req.body);
        const { name, description, duration, userId } = req.body;
        
        // Validate required fields
        if (!name || !description || !duration || !userId) {
            console.log('Missing required fields');
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields (name, description, duration, userId)'
            });
        }

        console.log('Creating new test with data:', { name, description, duration, userId });
        
        const test = new Test({
            name,
            description,
            duration,
            creator: userId
        });

        await test.save();
        console.log('Test saved successfully:', test);

        res.status(201).json({
            success: true,
            message: 'Test created successfully',
            test
        });
    } catch (error) {
        console.error('Error creating test:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating test',
            error: error.message
        });
    }
}

// Get a single test by ID
async function getTestById(req, res) {
    try {
        const test = await Test.findById(req.params.id).populate('creator', 'fullname email');
        
        if (!test) {
            return res.status(404).json({
                success: false,
                message: 'Test not found'
            });
        }

        res.status(200).json({
            success: true,
            test
        });
    } catch (error) {
        console.error('Error fetching test:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching test',
            error: error.message
        });
    }
}

// Update a test
async function updateTest(req, res) {
    try {
        const { name, description, duration } = req.body;
        const testId = req.params.id;

        const test = await Test.findById(testId);

        if (!test) {
            return res.status(404).json({
                success: false,
                message: 'Test not found'
            });
        }

        // Optional: Check if user is the creator of the test
        // if (test.creator.toString() !== req.user._id.toString()) {
        //     return res.status(403).json({
        //         success: false,
        //         message: 'Not authorized to update this test'
        //     });
        // }

        const updatedTest = await Test.findByIdAndUpdate(
            testId,
            { name, description, duration },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Test updated successfully',
            test: updatedTest
        });
    } catch (error) {
        console.error('Error updating test:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating test',
            error: error.message
        });
    }
}

// Delete a test
async function deleteTest(req, res) {
    try {
        const test = await Test.findById(req.params.id);

        if (!test) {
            return res.status(404).json({
                success: false,
                message: 'Test not found'
            });
        }

        // Optional: Check if user is the creator of the test
        // if (test.creator.toString() !== req.user._id.toString()) {
        //     return res.status(403).json({
        //         success: false,
        //         message: 'Not authorized to delete this test'
        //     });
        // }

        await test.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Test deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting test:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting test',
            error: error.message
        });
    }
}

module.exports = {
    getTests,
    createTest,
    getTestById,
    updateTest,
    deleteTest
};