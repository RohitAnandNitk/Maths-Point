const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    test_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Test',
        required: true
    },
    text: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        default: 'objective',
        enum: ['objective', 'subjective','both']
    },
    options: {
        type:Array,
        required: true,

    },
    correct_option: {
        type: String,
        required: true
    },

})

module.exports = mongoose.model('Question', questionSchema);