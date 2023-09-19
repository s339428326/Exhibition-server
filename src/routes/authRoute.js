const express = require('express');

//controller
const authController = require('../controller/authController');

const router = express.Router();

//authenticate
router.route('/').get(authController.authAndReturnUserData);

//auth
router.route('/singup').post(authController.singUp);
router.route('/login').post(authController.login);

router.use(authController.protect);

router.route('/:id').put(authController.updatePassword);

module.exports = router;
