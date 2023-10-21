const express = require('express');

const adminController = require('../controller/adminController');

//controller
const router = express.Router();

//test
router.route('/login').post(adminController.login);

module.exports = router;
