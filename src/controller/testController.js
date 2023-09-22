const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
// const Email = require('../utils/Email');

exports.sendTestMail = catchAsync(async (req, res, next) => {
  if (!mail) return next(new AppError('傳送信箱失敗'), 400);

  res.status(200).json({
    status: '成功',
  });
});
