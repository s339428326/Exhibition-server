//展覽控制
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const handlerFactory = require('./handlerFactory');
const Exhibition = require('../model/exhibitionModel');

exports.getAllExhibition = handlerFactory.getAll(Exhibition);
exports.getExhibition = handlerFactory.getOne(Exhibition);
exports.createExhibition = handlerFactory.create(Exhibition);
exports.deleteExhibition = handlerFactory.deleteOne(Exhibition);
