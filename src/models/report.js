const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    status: {
        type: String,
        enum: ['up', 'down'],
        require: true
    },
    availability: {
        type: Number,
        required: true
    },
    outages: {
        type: Number,
        required: true
    },
    downtime: {
        type: Number,
        required: true
    },
    uptime: {
        type: Number,
        required: true
    },
    responseTime: {
        type: Number,
        required: true
    },
    check: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Check'
    }
}, { timestamps: true });

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;