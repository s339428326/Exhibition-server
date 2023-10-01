const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const handlerFactory = require('./handlerFactory');
const Exhibition = require('../model/exhibitionModel');

exports.startUp = catchAsync(async (req, res, next) => {
  const exhibition = await Exhibition.find({});

  if (!exhibition.length)
    return next(new AppError('MongoDB vercel fail!', 404));

  //test get env var
  res.status(200).json({
    status: 'start',
    exhibition,
  });
});
