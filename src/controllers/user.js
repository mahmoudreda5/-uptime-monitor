const User = require('./../models/user');

const register = async (req, res) => {
    try {
        const email = req.body.email;
        let user = await User.findOne({ email });
        if(!user) {
            user = new User(req.body); 
            const token = await user.generateAuthToken();
            return res.status(201).send({ token, user });
        }
        return res.status(409).send('User already exists');
    } catch (e) {
        res.status(400).send(e.message);
    }
};

const login = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = await User.findByCredentails(email, password);
        const token = await user.generateAuthToken();
        res.send({ token, user });
    } catch (e) {
        return res.status(401).send(e.message);
    }
};

const logout = async (req, res) => {
    try {
        const user = req.user;
        await user.logout(req.token);
        return res.send(user);
    } catch (e) {
        return res.status(500).send(e.message);
    }
}

const updateUserProfile = async (req, res) => {
    try {
        if(!User.isValidUpdate(req)) {
            return res.status(404).send('Invalid updates.');
        }
        const user = req.user;
        await user.updateProfile(req);
        return res.send(user);
    } catch(e) {
        return res.status(400).send(e.message);
    }
};

module.exports = {
    register,
    login,
    logout,
    updateUserProfile
};

