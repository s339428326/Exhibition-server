const express = require('express');

//controller
const authController = require('../controller/authController');
const departmentController = require('../controller/departmentController');

//model
const Worker = require('../model/workerModel');
const router = express.Router();

router.use(authController.protect(Worker));

//department
router
  .route('/')
  .get(departmentController.getAllDepartment)
  .post(
    authController.restrictTo('admin'),
    departmentController.createDepartment
  );

router.route('/:id').get(departmentController.getDepartment);

module.exports = router;
