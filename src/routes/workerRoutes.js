const express = require('express');

const authController = require('../controller/authController');
const adminController = require('../controller/adminController');
const Worker = require('../model/workerModel');
const router = express.Router();

//暫時使用API新增帳戶
router.route('/singUp').post(authController.singUp(Worker));

//登入
router.route('/login').post(authController.login(['admin'], Worker));

//認證
router.route('/auth').get(authController.authAndReturnUserData(Worker));

//新員工申請單(N/A)
module.exports = router;
