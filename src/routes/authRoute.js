const express = require('express');

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
router.route('/').get(authController.authAndReturnUserData);

//Login and Singup
router.route('/singup').post(authController.singUp);
router.route('/login').post(authController.login);

//protect Route(這裡以下都會需要登入後才可使用)
router.use(authController.protect);

router.route('/:id').put(authController.updatePassword);

module.exports = router;
