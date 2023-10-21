const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
// const handlerFactory = require('./handlerFactory');
// const User = require('../model/userModel');
const Exhibition = require('../model/exhibitionModel');
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

exports.getUserTickets = catchAsync(async (req, res, next) => {
  const tickets = await Order.find({ userId: req.params?.id });

  const data = tickets
    .map((item) => item.orderList)
    .reduce((pre, next) => pre.concat(next));

  res.status(200).json({
    status: 'success',
    result: data.length,
    data,
  });
});

exports.checkerTicket = catchAsync(async (req, res, next) => {
  //Step.1 檢查展覽是否存在
  if (!req.params?.id)
    return next(new AppError('[API Error] 請帶入 /:id', 404));
  const exhibition = await Exhibition.findById(req.params?.id);
  if (!exhibition) return next(new AppError('此展覽不存在', 404));
  //Step2. 找該用戶ticketList 中該展覽ticketList
  ///////////////////////////////
  //ticketState: ['unused', 'using', 'used']
  //Step.3 檢查該帳戶是否有展覽票
  //1. 該帳戶沒有展覽票 Error 沒有展覽票
  //2. 該帳戶已經在使用該展覽票卷入場using, Error 該帳戶已經入場
  //3. 該帳戶只有單一票卷
  const tickets = await Order.findOne({
    'orderList._id': new ObjectId(req.params?.id),
  });
  const ticket = tickets.orderList.filter((item) => item._id == req.params?.id);
  res.status(200).json({
    data: 'building...',
    ticket,
  });
});

//
exports.getTicketQrcode = catchAsync(async (req, res, next) => {});
