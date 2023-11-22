//公司員工控制
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const handlerFactory = require('./handlerFactory');

const Worker = require('../model/workerModel');

exports.createWorker = catchAsync(async (req, res, next) => {
  const { username, email, role, department } = req.body;

  if (!username || !email || !role || !department)
    return next(new AppError('表單傳送失敗!, 請通知資訊室'));

  //username, email, role, department
  const worker = await Worker.create({ username, email, role, department });

  res.status(200).json({
    status: 'success',
    data: worker,
  });
});
