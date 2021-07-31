const express = require('express');
const router = express.Router();

const CheckController = require('./../controllers/check');
const auth = require('../middleware/auth');

router.post('/checks', auth, CheckController.create);
router.get('/checks/all', auth, CheckController.retrieveAll);
router.get('/checks/:id', auth, CheckController.retrieve);
router.patch('/checks/:id', auth, CheckController.update);
router.delete('/checks/:id', auth, CheckController.remove);

router.get('/checks/run/:id', auth, CheckController.run);
router.get('/checks/report/:checkId', auth, CheckController.retrieveReport);

module.exports = router;