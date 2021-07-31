const mongoose = require('mongoose');
const validator = require('validator');

const checkSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    url: {
        type: String,
        required: true,
        trim: true
    },
    protocol: {
        type: String,
        enum: ['HTTP', 'HTTPS', 'TCP'],
        required: true
    },
    path: {
        type: String,
        trim: true
    },
    port: {
        type: Number,
        validate(port) {
            if(!validator.isPort(port.toString())) {
                throw new Error('Invalid port number');
            }
        }
    },
    webhook: {
        type: String,
        trim: true,
        validate(webhook) {
            if(!validator.isURL(webhook)) {
                throw new Error('Invalid webhook');
            }
        }
    },
    timeout: {
        type: Number,
        default: 5
    },
    interval: {
        type: Number,
        default: 10
    },
    threshold: {
        type: Number,
        default: 1
    },
    authentication: {
        type: {
            username: {
                type: String,
                required: true
            },
            password: {
                type: String,
                required: true
            }
        },
    },
    httpHeaders: {
        type: Map,
        of: String
    },
    assert: {
        type: {
            statusCode: {
                type: Number,
                required: true
            }
        }
    },
    tags: [{
        tag: {
            type: String,
            required: true
        }
    }],
    ignoreSSL: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, { timestamps: true });


checkSchema.statics.isValidUpdate = (req) => {
    const allowedUpdates = [
        'name', 
        'url', 
        'protocol', 
        'path', 
        'port', 
        'webhook', 
        'timeout', 
        'interval', 
        'threshold', 
        'authentication', 
        'httpHeaders', 
        'assert', 
        'tags', 
        'ignoreSSL'
    ];
    const updates = Object.keys(req.body);
    return updates.every(item => {
        return allowedUpdates.includes(item);
    });
};

checkSchema.methods.update =  async function (req) {
    const check = this;
    const updates = Object.keys(req.body);
    updates.forEach(update => check[update] = req.body[update]);
    return await check.save();
};

// relationships
checkSchema.virtual('logs', {
    ref: 'Log',
    localField: '_id',
    foreignField: 'check'
});

checkSchema.virtual('report', {
    ref: 'Report',
    localField: '_id',
    foreignField: 'check'
});

const Check = mongoose.model('Check', checkSchema);

module.exports = Check;