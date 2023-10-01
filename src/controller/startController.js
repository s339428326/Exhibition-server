const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const handlerFactory = require('./handlerFactory');

exports.startUp = catchAsync(async (req, res, next) => {
  //test get env var
  const { DATABASE } = process.env;
  res.status(200).json({
    status: 'start',
    DATABASE,
  });
});
