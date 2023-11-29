const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const handlerFactory = require('../controller/handlerFactory');
const Department = require('../model/departmentModel');

exports.createDepartment = handlerFactory.create(Department);
exports.getAllDepartment = handlerFactory.getAll(Department);
exports.getDepartment = handlerFactory.getOne(Department);
