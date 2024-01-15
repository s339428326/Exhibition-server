const express = require('express');

const authController = require('../controller/authController');
const platformEmailController = require('../controller/platformEmailController');

const Worker = require('../model/workerModel');

//controller
const router = express.Router();

router.use(authController.protect(Worker));

//
router
  .route('/')
  .get(platformEmailController.getAllEmail)
  .post(platformEmailController.createEmail);

router
  .route('/:id')
  .get(platformEmailController.getOneEmail)
  .patch(platformEmailController.sendEmail);

//router.route('/singUp').post(authController.singUp('inspector'))

module.exports = router;
