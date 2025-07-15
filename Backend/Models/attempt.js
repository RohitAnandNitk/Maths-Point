const mongoose = require('mongoose')

const attemptSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    test_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Test',
        required: true
    },
    answers: {
        type: Array,
        required: true
    },
    score:{
        type: Number,
        required: true
    },
    completed_at:{
        type: Date,
        required: true
    }
},{
    timestamps: true,
})

module.exports = mongoose.model('Attempt', attemptSchema);