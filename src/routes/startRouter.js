const express = require('express');

//controller
const startController = require('../controller/startController');

const router = express.Router();

router.route('/').get(startController.startUp);

module.exports = router;
