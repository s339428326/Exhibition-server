const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const handlerFactory = require('./handlerFactory');
const Exhibition = require('../model/exhibitionModel');

exports.startUp = catchAsync(async (req, res, next) => {
  //test get env var
  res.status(200).json({
    status: 'start',
  });
});
