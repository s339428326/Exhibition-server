// 展覽廠商控制
const AppError = require('../utils/AppError');
const APIFeatures = require('../utils/APIFeatures');
const catchAsync = require('../utils/catchAsync');
const Partner = require('../model/partnerModel');

exports.createPartner = catchAsync(async (req, res, next) => {
  const { username, role, company } = req?.body;
  if (!username || !role || !company)
    return next(new AppError('請確定表單資料是否填寫', 404));

  const partner = await Partner.create(req.body);
  if (!partner) return next(new AppError('未建立成功', 404));

  res.status(200).json({
    status: 'success',
    data: partner,
  });
});
