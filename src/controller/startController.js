const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const handlerFactory = require('./handlerFactory');
const Exhibition = require('../model/exhibitionModel');

exports.startUp = catchAsync(async (req, res, next) => {
  const exhibition = await Exhibition.find({});

  console.log(exhibition);

  if (!exhibition.length)
    return res.status(404).json({
      status: 'start',
      message: 'vercel next middleware fail!',
    });

  //test get env var
  res.status(200).json({
    status: 'start',
    exhibition,
  });
});
