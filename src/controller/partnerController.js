// 展覽廠商控制
const AppError = require('../utils/AppError');
const APIFeatures = require('../utils/APIFeatures');
const handlerFactory = require('../controller/handlerFactory');
const catchAsync = require('../utils/catchAsync');
const Partner = require('../model/partnerModel');
const generatePassword = require('../utils/generatePassword');
const Email = require('../utils/email');

//取得所有夥伴
exports.getAllPartner = handlerFactory.getAll(Partner);

//建立合作夥伴
exports.createPartner = catchAsync(async (req, res, next) => {
  const { company, comment } = req?.body;
  if (!company || !comment)
    return next(new AppError('請確定表單資料是否填寫', 404));

  const partner = await Partner.create({ ...req.body, role: 'host' });
  if (!partner) return next(new AppError('未建立成功', 404));

  res.status(200).json({
    status: 'success',
    data: partner,
  });
});

//合作夥伴 host 帳戶, 更新isActive
exports.activeHostPartner = catchAsync(async (req, res, next) => {
  const partner = await Partner.findById(req.params?.id).select(
    '-password -passwordChangedAt'
  );
  if (!partner) return next(new AppError('無此帳戶', 403));
  // if (partner.firstPassword) return next(new AppError('請勿重複開通', 403));
  //firstPassword
  //isActive
  const randomPassword = generatePassword(8);

  partner.role = 'host';
  partner.isActive = true;
  partner.firstPassword = randomPassword;
  partner.password = randomPassword;

  await partner.save();

  await new Email(
    null,
    `${
      process.env?.[
        `${
          process.env.NODE_ENV === 'production'
            ? 'FRONT_END_SERVER'
            : 'FRONT_END_LOCAL'
        }`
      ]
    }/#/admin/login`
  ).sendPartnerActiveEmail(partner);

  res.status(200).json({
    status: 'success',
    partner,
  });
});

/////////////夥伴專用///////////////////
//合作夥伴新增現場員工
exports.partnerAddSitePerson = catchAsync(async (req, res, next) => {
  res.state(200).json({
    status: 'test',
  });
});

//取得廠商申請通過所有展覽列筆
exports.getPartnerExhibitions = catchAsync(async (req, res, next) => {
  const partner = await Partner.findById(req.params?.id);

  res.status(200).json({
    status: 'success',
    data: partner.e,
  });
});
