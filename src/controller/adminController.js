//最高權限資料控制
const Worker = require('../model/workerModel');
const Department = require('../model/departmentModel');

const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const handlerFactory = require('../controller/handlerFactory');

//worker
exports.getAllWorker = handlerFactory.getAll(Worker);
exports.getWorker = handlerFactory.getOne(Worker);
exports.createWorker = handlerFactory.create(Worker);
exports.deleteWorker = handlerFactory.deleteOne(Worker);

//department
exports.createDepartment = handlerFactory.create(Department);
exports.getAllDepartment = handlerFactory.getAll(Department);
