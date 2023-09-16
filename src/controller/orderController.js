const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const handlerFactory = require('./handlerFactory');
const User = require('../model/userModel');
const Order = require('../model/orderModel');

exports.getAllOrder = handlerFactory.getAll(Order);
exports.getOrder = handlerFactory.getOne(Order);
exports.createOrder = handlerFactory.create(Order);
exports.deleteOrder = handlerFactory.deleteOne(Order);
