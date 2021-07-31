const Check = require('./../models/check');

const create = async (req, res) => {
    try {
        const check = new Check({
            ...req.body,
            owner: req.user._id
        });
        await check.save();
        return res.status(201).send(check);
    } catch (e) {
        return res.status(400).send(e.message);
    }
};

const retrieveAll = async (req, res) => {
    try {
        const user = req.user;
        await user.populate('checks').execPopulate();
        return res.send(user.checks);
    } catch (e) {
        return res.status(500).send(e.message);
    }
};

const retrieve = async (req, res) => {
    try {
        const _id = req.params.id;
        const owner = req.user._id;

        const check = await Check.findOne({ _id, owner });
        if(!check) {
            return res.status(404).send('check not found!');
        }
        return res.send(check);
    } catch (e) {
        return res.status(500).send(e.message);
    }
};

const update = async (req, res) => {
    try {
        if(!Check.isValidUpdate(req)) {
            return res.status(400).send('Invalid updates');
        }
        const _id = req.params.id;
        const owner = req.user._id;
        const check = await Check.findOne({ _id, owner });
        if(!check) {
            return res.status(404).send('check not found');
        }
        await check.update(req);
        return res.send(check);
    } catch (e) {
        return res.status(400).send(e.message)
    }
};

const remove = async (req, res) => {
    try {
        const _id = req.params.id;
        const owner = req.user._id;
        const check = await Check.findOneAndDelete({ _id, owner });
        if(!check) {
            return res.status(404).send('check not found');
        }
        return res.send(check);
    } catch (e) {
        return res.status(500).send(e.message);
    }
};

module.exports = {
    create,
    retrieveAll,
    retrieve,
    update,
    remove
};