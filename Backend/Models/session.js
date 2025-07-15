const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    token:{
        type: String,
    },

},
    {
        timestamps: true,
    })

module.exports = mongoose.model('Session', sessionSchema)