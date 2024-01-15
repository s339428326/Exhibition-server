//admin 暫時清空
const express = require('express');

const authController = require('../controller/authController');
const adminController = require('../controller/adminController');
const Worker = require('../model/workerModel');

//controller
const router = express.Router();

//以下為最高權限, CRUD前台普通用戶
// router.use(authController.protect(Worker), authController.restrictTo('admin'));

router.route('/worker').post(adminController.createWorker);

module.exports = router;
