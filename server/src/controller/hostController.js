//策展人員 API
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const qrcode = require('qrcode');
const jwt = require('jsonwebtoken');
const handlerFactory = require('./handlerFactory');
const Exhibition = require('../model/exhibitionModel');

//給現場展覽使用Qrcode
exports.getExhibitionQrcode = catchAsync(async (req, res, next) => {
  if (!req.params?.id)
    return next(new AppError('[getExhibitionQrcode] 請帶入 /:id', 404));
  const exhibition = await Exhibition.findById(req.params?.id);
  if (!exhibition) return next(new AppError('此展覽不存在', 404));
  //
  const token = jwt.sign(
    { exhibitionId: exhibition?.id },
    process.env.EXHIBITION_SECRET
  );

  let exhibitonQrcode = await qrcode.toDataURL(token);

  if (!exhibitonQrcode) return next(new AppError('Qrcode 產生錯誤', 404));

  //   const jwtQrocode =
  res.status(200).json({
    data: 'success',
    exhibitonQrcode,
  });
});
