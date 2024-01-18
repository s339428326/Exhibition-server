const express = require('express');

const authController = require('../controller/authController');
const partnerController = require('../controller/partnerController');
const Partner = require('../model/partnerModel');
const Worker = require('../model/workerModel');

//controller
const router = express.Router();

// Partner
router
  .route('/login')
  .post(authController.login(['inspector', 'host']), Partner);

// Worker 後台工作人員用
router.use(authController.protect(Worker));

router
  .route('/')
  .get(partnerController.getAllPartner)
  .post(partnerController.createPartner);

router.route('/active/:id').post(partnerController.activeHostPartner);

module.exports = router;
