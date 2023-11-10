const express = require('express');

const authController = require('../controller/authController');
const Partner = require('../model/partnerModel');

//controller
const router = express.Router();

//partner
router
  .route('/login')
  .post(authController.login(['inspector', 'host']), Partner);

//router.route('/singUp').post(authController.singUp('inspector'))

module.exports = router;
