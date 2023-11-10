//最高權限資料控制
const User = require('../model/userModel');

const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const handlerFactory = require('../controller/handlerFactory');

exports.getAllUser = handlerFactory.getAll(User);
exports.getUser = handlerFactory.getOne(User);
exports.createUser = handlerFactory.create(User);
exports.deleteUser = handlerFactory.deleteOne(User);
