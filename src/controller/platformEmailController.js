const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const Email = require('../utils/email.js');
const handlerFactory = require('../controller/handlerFactory');

const User = require('../model/userModel');
const PlatformEmail = require('../model/platformEmailModel');

exports.getAllEmail = handlerFactory.getAll(PlatformEmail);
exports.getOneEmail = handlerFactory.getOne(PlatformEmail);

exports.createEmail = catchAsync(async (req, res, next) => {
  const { subject, content, creator, type } = req.body;

  if (!subject || !content || !creator || !type)
    return next(new AppError('請檢查Email是否填寫正確'), 403);

  const platformEmail = await PlatformEmail.create({
    subject,
    content,
    creator,
    type,
  });

  res.status(200).json({
    status: 'success',
    data: platformEmail,
  });
});

exports.sendEmail = catchAsync(async (req, res, next) => {
  // 可以決定寄信只有部門經裡 department position:'manger'
  if (req?.user?.position !== 'manger')
    return next(new AppError('請確認權限不能審核信件', 403));
  const platformEmail = await PlatformEmail.findByIdAndUpdate(
    req.params.id,
    {
      $set: { isApproved: true, checker: req.body.checker, sendAt: new Date() },
    },
    { new: true }
  );

  if (!platformEmail)
    return next(new AppError('請確認該 信件id 或 審核人員id 是否存在', 403));

  const { subject, content } = platformEmail;

  // all users email array
  const users = (await User.find({}, 'email')).map((it) => it.email);

  // PlatformEmail 平台信件資料庫schema
  // await new Email(
  //   null,
  //   `${
  //     process.env?.[
  //       `${
  //         process.env.NODE_ENV === 'production'
  //           ? 'FRONT_END_SERVER'
  //           : 'FRONT_END_LOCAL'
  //       }`
  //     ]
  //   }/Exhibition-front-end/`
  // ).sendPlatformEmail(subject, content, users);

  await new Email(
    null,
    `${process.env?.['FRONT_END_LOCAL']}/Exhibition-front-end/`
  ).sendPlatformEmail(subject, content, users);

  res.status(200).json({
    status: 'success',
    data: platformEmail,
  });
});
