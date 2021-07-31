const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Check = require('./check');
const config = require('./../config/config');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate(email) {
            if(!validator.isEmail(email)) {
                throw new Error('invalid email');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 6
    },
    verified: {
        type: Boolean,
        default: false
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, { timestamps: true });

// model methods
userSchema.statics.findByCredentails = async (email, password) => {
    const user = await User.findOne({ email });
    if(!user) {
        throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
        throw new Error('Unable to login');
    }

    return user;
};

userSchema.statics.isValidUpdate = (req) => {
    const allowedUpdates = ['firstName', 'lastName', 'email', 'password'];
    const updates = Object.keys(req.body);
    return updates.every(item => {
        return allowedUpdates.includes(item);
    });
}

// instance methods
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, config.jwtSecretKey);

    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
};

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    return userObject;
}

userSchema.methods.logout = async function (authToken) {
    const user = this;
    user.tokens = user.tokens.filter(token => {
        return token.token !== authToken;
    });

    return await user.save();
};

userSchema.methods.updateProfile = async function (req) {
    const user = this;
    const updates = Object.keys(req.body);
    updates.forEach(update => user[update] = req.body[update]);
    return await user.save();
};

// relationships
userSchema.virtual('checks', {
    ref: 'Check',
    localField: '_id',
    foreignField: 'owner'
});

// hash plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this;
    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

userSchema.pre('remove', async function (next) {
    const user = this;

    await Check.deleteMany({ owner: user._id });
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;