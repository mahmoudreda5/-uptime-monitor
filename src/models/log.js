const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    status: {
        type: String,
        enum: ['up', 'down'],
        required: true,
        default: 'up'
    },
    check: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Check'
    }
}, { timestamps: true });

const Log = mongoose.model('Log', logSchema);

module.exports = Log;