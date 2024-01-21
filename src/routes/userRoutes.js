const express = require('express');
const User = require('../model/userModel');

//controller
const authController = require('../controller/authController');
const userController = require('../controller/userController');

const router = express.Router();

router.use(authController.protect(User));

router.route('/').get(userController.getAllUsers);

router.route('/exhibition').get(userController.getUserTrackList);
router.route('/exhibition/:id').get(userController.addTrackExhibition);
router.route('/exhibition/:id').delete(userController.deleteTrackExhibition);

//[FIX] 這次改在用戶端更新 imgur url to 後端
// router.route('/uploadAvatar').post(userController.uploadImage('avatar'));

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.patchUser);

module.exports = router;
