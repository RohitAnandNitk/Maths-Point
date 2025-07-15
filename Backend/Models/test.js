const mongoose = require('mongoose')

const testSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,

    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        // required: true,
    },
    duration: {
        type: String,
        required: true,
    }

},{
    timestamps: true,
})

module.exports = mongoose.model('Test',testSchema);