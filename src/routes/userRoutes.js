const express = require('express');

//controller
const authController = require('../controller/authController');
const userController = require('../controller/userController');

const router = express.Router();

router.use(authController.protect);

router.route('/').get(userController.getAllUsers);

//[FIX] 這次改在用戶端更新 imgur url to 後端
// router.route('/uploadAvatar').post(userController.uploadImage('avatar'));

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.patchUser);

module.exports = router;
