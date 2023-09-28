const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const handlerFactory = require('./handlerFactory');
const User = require('../model/userModel');
const Order = require('../model/orderModel');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

exports.getAllOrder = handlerFactory.getAll(Order);
exports.getOrder = handlerFactory.getOne(Order);
exports.createOrder = handlerFactory.create(Order);
exports.deleteOrder = handlerFactory.deleteOne(Order);

exports.getUserOrder = catchAsync(async (req, res, next) => {
  const orders = await Order.aggregate([
    {
      $match: { userId: new ObjectId(req.params?.id) },
    },
    {
      $unwind: '$orderList',
    },
    {
      $group: {
        _id: {
          _id: '$_id',
          name: '$orderList.name',
          ticketType: '$orderList.ticketType.ticketType',
        },
        name: { $first: '$name' },
        address: { $first: '$address' },
        isPay: { $first: '$isPay' },
        phone: { $first: '$phone' },
        total: { $first: '$total' },
        createAt: { $first: '$createAt' },
        quantity: { $sum: 1 },
        id: { $first: '$orderList.id' },
        price: { $first: '$orderList.price' },
        ticketsId: { $push: '$orderList._id' },
      },
    },
    {
      $group: {
        _id: '$_id._id',
        name: { $first: '$name' },
        address: { $first: '$address' },
        phone: { $first: '$phone' },
        isPay: { $first: '$isPay' },
        total: { $first: '$total' },
        createAt: { $first: '$createAt' },
        orderList: {
          $push: {
            quantity: '$quantity',
            price: '$price',
            ticketsId: '$ticketsId',
            _id: '$id',
            name: '$_id.name',
            ticketType: '$_id.ticketType',
          },
        },
      },
    },
  ]);

  if (!orders) return next(new AppError('無此 用戶Id', 404));

  res.status(200).json({
    status: '成功',
    result: orders.length,
    orders,
  });
});
