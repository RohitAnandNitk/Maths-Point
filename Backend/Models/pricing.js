const mongoose = require('mongoose');

const pricingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: true,
    },
    features:{
        type: Array,
        required: true
    }
    

},{
    timestamps: true,
})

model.exports = mongoose.model('Pricing', pricingSchema);