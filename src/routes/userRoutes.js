const express = require('express');

//controller
const authController = require('../controller/authController');
const userController = require('../controller/userController');

const router = express.Router();

router.use(authController.protect);

router.route('/').get(userController.getAllUsers);

//update user avatar
router.route('/uploadAvatar').post(userController.uploadImage('avatar'));

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.patchUser);

module.exports = router;
