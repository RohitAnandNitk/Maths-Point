const Question = require('../Models/question');

async function addQuestion(req, res){
    try{
    console.log('Inside addQuestion');
        const {testId} = req.params;
        const {text, type, options, correct_option} = req.body;
        const question = new Question({
            test_id: testId,
            text,
            type,
            options,
            correct_option
        });
        await question.save();
        res.status(201).json({
            success: true,
            message: 'Question added successfully',
            question
        });
    }catch(error){
        console.error('Error adding question:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

async function updateQuestion(req, res){
    

}

async function deleteQuestion(req, res){
    try{
        const {questionId, testId}= req.params;
        const question = await Question.findOne({ _id: questionId, test_id: testId });

        if(!question){
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            })
        }
        await question.remove();
        res.status(200).json({
            success: true,
            message: 'Question deleted successfully'
        });

    }catch(error){
        console.error('Error deleting question:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}



module.exports = {
    addQuestion,
    deleteQuestion,
    updateQuestion,
}
