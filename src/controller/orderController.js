const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const ecpayment = require('../utils/ecpayment');
const handlerFactory = require('./handlerFactory');
const User = require('../model/userModel');
const Order = require('../model/orderModel');

const ecpay_payment = require('ecpay_aio_nodejs');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

exports.getAllOrder = handlerFactory.getAll(Order);
exports.getOrder = handlerFactory.getOne(Order);
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
    status: 'success',
    result: orders.length,
    orders,
  });
});

// Ec payment issue take new felid MerchantTradeNo
exports.createOrder = catchAsync(async (req, res, next) => {
  const {
    TradeDesc,
    TotalAmount,
    ItemName,
    userId,
    name,
    phone,
    address,
    total,
    orderList,
  } = req.body;

  let missItems = [];

  Object.entries(req.body).forEach(([key, value]) => {
    if (!req.body[key]) {
      missItems.push(key);
    }
  });

  if (missItems.length > 0) {
    return next(new AppError(`請檢查 ${missItems.toString()} 未正確填寫`, 404));
  }

  //將重複票卷, 成獨立資料
  let newCartList = [];
  orderList.forEach((item) => {
    if (item?.quantity > 1) {
      for (let i = 0; i < item?.quantity; i++) {
        newCartList.push(item);
      }
    } else {
      newCartList.push(item);
    }
  });

  const base_param = ecpayment.genBaseParam(TotalAmount, TradeDesc, ItemName);

  const create = new ecpay_payment(ecpayment.options);
  const html = create.payment_client.aio_check_out_all(base_param);

  //create order
  const order = await Order.create({
    userId,
    name,
    phone,
    address,
    total,
    orderList: newCartList,
    MerchantTradeNo: base_param.MerchantTradeNo,
  });

  res.status(200).json({
    status: 'success',
    html,
    order,
  });
});
