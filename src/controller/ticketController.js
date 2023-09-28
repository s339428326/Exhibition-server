const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const handlerFactory = require('./handlerFactory');
const User = require('../model/userModel');
const Order = require('../model/orderModel');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

exports.getTicketData = catchAsync(async (req, res, next) => {
  const tickets = await Order.findOne({
    'orderList._id': new ObjectId(req.params?.id),
  });

  const ticket = tickets.orderList.filter((item) => item._id == req.params?.id);

  res.status(200).json({
    status: 'success',
    ticket: ticket[0],
  });
});
