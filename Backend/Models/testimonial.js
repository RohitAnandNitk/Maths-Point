const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },


},{
    timestamps: true
});

module.exports = mongoose.model('Testimonial', testimonialSchema);