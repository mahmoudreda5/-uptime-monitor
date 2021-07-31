const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    status: {
        type: String,
        enum: ['up', 'down'],
        require: true,
        default: 'up'
    },
    availability: {
        type: Number,
        required: true,
        default: 0
    },
    outages: {
        type: Number,
        required: true,
        default: 0
    },
    downtime: {
        type: Number,
        required: true,
        default: 0
    },
    uptime: {
        type: Number,
        required: true,
        default: 0
    },
    responseTime: {
        type: Number,
        required: true,
        default: 0
    },
    check: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Check'
    }
}, { timestamps: true });

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;