const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, 'random');
        const user = await User.findOne({
             _id: decoded._id,
             'tokens.token': token
        });
        if(!user) {
            throw new Error();
        }
        req.user = user;
        req.token = token;
        next();
    } catch (e) {
        return res.status(401).send('Not authenticated');
    }
};

module.exports = auth;