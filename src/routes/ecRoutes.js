const express = require('express');

//controller
const ECPayPaymentController = require('../controller/ECpaymentController');

const router = express.Router();

router.route('/').post(ECPayPaymentController.createECOrder);

module.exports = router;
