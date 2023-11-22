const express = require('express');
const User = require('../model/userModel');

//controller
const exhibitionController = require('../controller/exhibitionController');
const authController = require('../controller/authController');

const router = express.Router();

router.route('/').get(exhibitionController.getAllExhibition);
router.route('/:id').get(exhibitionController.getExhibition);

router.use(authController.protect(User), authController.restrictTo('admin'));

router.route('/').post(exhibitionController.createExhibition);
router.route('/:id').delete(exhibitionController.deleteExhibition);

module.exports = router;
