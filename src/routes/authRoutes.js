const express = require('express');
const User = require('../model/userModel');

//controller
const authController = require('../controller/authController');

const router = express.Router();

//check resetToken vialed
router.post('/checkResetToken/:token', authController.checkResetToken);

//send forget email to user
router.post('/forgetPassword', authController.forgetPassword);

//change password
router.post('/resetPassword/:token', authController.resetPassword);

//send  change email to user
router.post('/changeEmail', authController.changeEmail);

//change Email
router.post('/resetEmail/:token', authController.resetEmail);

//authenticate
router.route('/').get(authController.authAndReturnUserData(User));

//Login and Singup
router.route('/singup').post(authController.singUp(User));
router.route('/login').post(authController.login(['user'], User));

//protect Route(這裡以下都會需要登入後才可使用)
router.use(authController.protect(User));

router.route('/:id').put(authController.updatePassword);

module.exports = router;
