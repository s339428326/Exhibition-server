const express = require('express');

//controller
const exhibitionController = require('../controller/exhibitionController');
const authController = require('../controller/authController');

const router = express.Router();

router.route('/').get(exhibitionController.getAllExhibition);
router.route('/:id').get(exhibitionController.getExhibition);

router.use(authController.protect, authController.restrictTo('admin'));

router.route('/').post(exhibitionController.createExhibition);
router.route('/:id').delete(exhibitionController.deleteExhibition);

module.exports = router;
