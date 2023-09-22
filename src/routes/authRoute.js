const express = require('express');

//controller
const authController = require('../controller/authController');

const router = express.Router();

//check resetToken vialed
router.post('/checkResetToken/:token', authController.checkResetToken);

//forget password(Not login) send url(/resetPassword/:token) to user email
router.post('/forgetPassword', authController.forgetPassword);

//change password router restrictTo
router.post('/resetPassword/:token', authController.resetPassword);

//authenticate
router.route('/').get(authController.authAndReturnUserData);

//auth
router.route('/singup').post(authController.singUp);
router.route('/login').post(authController.login);

router.use(authController.protect);

router.route('/:id').put(authController.updatePassword);

module.exports = router;
