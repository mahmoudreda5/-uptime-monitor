const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    status: {
        type: String,
        enum: ['up', 'down'],
        required: true,
        default: 'up'
    }
}, { timestamps: true });

const Log = mongoose.model('Log', logSchema);

module.exports = Log;