const express = require('express');

//controller
const orderController = require('../controller/orderController');

const router = express.Router();

router
  .route('/')
  .get(orderController.getAllOrder)
  .post(orderController.createOrder);

router
  .route('/:id')
  .get(orderController.getOrder)
  .delete(orderController.deleteOrder);

router.route('/user/:id').get(orderController.getUserOrder);

module.exports = router;
