const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const handlerFactory = require('./handlerFactory');
const User = require('../model/userModel');
const Order = require('../model/orderModel');

exports.getAllOrder = handlerFactory.getAll(Order);
exports.getOrder = handlerFactory.getOne(Order);
exports.createOrder = handlerFactory.create(Order);
exports.deleteOrder = handlerFactory.deleteOne(Order);

exports.getUserOrder = catchAsync(async (req, res, next) => {
  console.log(req.params?.id);
  const order = await Order.find({ localId: req.params?.id });

  if (!order) return next(new AppError('無此 用戶Id', 404));

  res.status(200).json({
    status: '成功',
    result: order.length,
    data: order,
  });
});
