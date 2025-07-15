const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'student',
        enum: ['student', 'teacher', 'admin'],
    },
    avatar: {
        type: String,
        default: ''
    },
    pricing_plans: [{
        plan_id: { type: mongoose.Schema.Types.ObjectId, ref: 'PricingPlan' },
        subscription_start_date: { type: Date, default: Date.now },
        status: { type: String, default: 'active', enum: ['active', 'expired'] }
    }],
},
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);