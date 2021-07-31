const express = require('express');
const router = express.Router();

const UserController = require('./../controllers/user');
const auth = require('../middleware/auth');

router.post('/users/register', UserController.register);
router.post('/users/login', UserController.login);
router.post('/users/logout', auth, UserController.logout);
router.patch('/users/me', auth, UserController.updateProfile);

module.exports = router;