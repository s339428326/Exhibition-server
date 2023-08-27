const express = require('express');

//controller
const authController = require('../controller/authController');
const userController = require('../controller/userController');

const router = express.Router();

//auth
router.route('/singup').post(authController.singUp);
router.route('/login').post(authController.login);
router.route('/isLogin').post(authController.isLogin);

router.use(authController.protect);

// user Data
router.route('/uploadAvatar').post(userController.uploadImage('avatar'));

router.route('/:id').put(authController.updatePassword);

//user update information
// router.route('/uploadAvatar').post(userController.uploadImage('avatar'));
// router.route('/uploadInfo').post(userController.uploadInfo);

module.exports = router;
