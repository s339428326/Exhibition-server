const express = require('express');

//controller
const hostController = require('../controller/hostController');
const authController = require('../controller/authController');

const router = express.Router();

//ex:
// router.route('/').get(exhibitionController.getAllExhibition);
// router.use(authController.protect, authController.restrictTo('admin'));

router.route('/exhibition/qrcode/:id').get(hostController.getExhibitionQrcode);

module.exports = router;
