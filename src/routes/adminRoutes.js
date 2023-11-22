const express = require('express');

const authController = require('../controller/authController');
const adminController = require('../controller/adminController');
const Worker = require('../model/workerModel');

//controller
const router = express.Router();

//以下為最高權限, CRUD前台普通用戶
router.use(authController.protect(Worker), authController.restrictTo('admin'));

//Worker
//[Feature]Worker create => rebuild
router
  .route('/worker')
  .get(adminController.getAllWorker)
  .post(adminController.createWorker);

router
  .route('/worker/:id')
  .get(adminController.getWorker)
  .delete(adminController.deleteWorker);

//department
router.route('/department').post(adminController.createDepartment);

module.exports = router;
