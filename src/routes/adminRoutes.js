const express = require('express');

const authController = require('../controller/authController');
const adminController = require('../controller/adminController');

//controller
const router = express.Router();

//以下為最高權限, CRUD前台普通用戶
router.use(authController.restrictTo('admin'));

router
  .route('/user')
  .get(adminController.getAllUser)
  .post(adminController.createUser);

router
  .route('/user/:id')
  .get(adminController.getUser)
  .delete(adminController.deleteUser);

module.exports = router;
