const express = require('express');

const authController = require('../controller/authController');
const workerController = require('../controller/workerController');
const Worker = require('../model/workerModel');
const router = express.Router();

//暫時使用API新增帳戶
router.route('/singUp').post(authController.singUp(Worker));

//登入
router
  .route('/login')
  .post(authController.login(['admin', 'manger', 'normal'], Worker));

//認證
router.route('/auth').get(authController.authAndReturnUserData(Worker));

router.use(authController.protect(Worker));

//新增員工用戶
router
  .route('/create')
  .post(authController.restrictTo('admin'), workerController.createWorker);

module.exports = router;
