const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Email = require('../utils/Email.js');

const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const loginFeature = require('../utils/loginFeature');
const singToken = require('../utils/JWTHandler');

const User = require('../model/userModel');

const sendJwtToClient = (user, statusCode, req, res) => {
  const token = singToken(user.id);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

//用戶權限
exports.restrictTo =
  (...role) =>
  (req, res, next) => {
    if (!role.includes(req.user.role)) {
      return next(new AppError('用戶權限不足', 403));
    }
    next();
  };

exports.protect = catchAsync(async (req, res, next) => {
  const { authorization } = req.headers;
  let token;

  //Postman Test using
  if (authorization && authorization.startsWith('Bearer')) {
    token = authorization.split(' ')[1];
    //for client
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  if (!process.env.JWT_SECRET) throw Error('請設定dotenv 文件');

  //1.確認token 是否存在
  if (!token) return next(new AppError('您還未登入！', 401));

  const { id, iat } = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(id);

  if (user?.changedPasswordAfter(iat))
    return next(new AppError('密碼已更改請重新嘗試登入', 403));

  req.user = user;

  next();
});

exports.authAndReturnUserData = catchAsync(async (req, res, next) => {
  const { authorization } = req.headers;
  let token = authorization?.startsWith('Bearer')
    ? authorization?.split(' ')[1]
    : authorization;

  if (!token) return next(new AppError('已登出', 403));

  //2.compare token is correct
  const { id } = jwt.verify(token, process.env.JWT_SECRET);

  const {
    email,
    avatar,
    cover,
    username,
    role,
    intro,
    cart,
    trackArtworkList,
  } = await User.findById(id);
  if (!email) return next(new AppError('請確認用戶是否存在', 404));

  //3.res pass
  res.status(200).json({
    status: 'success',
    user: {
      email,
      avatar,
      cover,
      username,
      role,
      id,
      intro,
      cart,
      trackArtworkList,
    },
  });
});

exports.singUp = catchAsync(async (req, res, next) => {
  const { username, email, password, confirmPassword } = req.body;

  if (!email || !password || !confirmPassword || !username)
    return next(new AppError('註冊失敗！ 請確認內容是否填寫正確'));

  const data = await User.create({
    username,
    email,
    password,
    confirmPassword,
  });

  await new Email(
    data,
    `${
      process.env?.[
        `${
          process.env.NODE_ENV === 'production'
            ? 'FRONT_END_SERVER'
            : 'FRONT_END_LOCAL'
        }`
      ]
    }/Exhibition-front-end/`
  ).sendWelcome();

  //未被建立返回 客製 Error
  if (!data) return next(new AppError('建立賬戶失敗 ！', 403));

  sendJwtToClient(data, 200, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError('登入失敗！， 請從新確認 email 或 password'), 400);

  const user = await User.findOne({ email }).select(
    '+password +loginCount +loginTime'
  );

  if (!user) return next(new AppError('請重新確認信箱與密碼'), 404);

  const isCorrectPassword = await user?.correctPassword(
    password,
    user.password
  );

  const isUserBlock = loginFeature.loginBlock(
    user,
    isCorrectPassword,
    60 * 60 * 1000,
    10
  );
  await user.save({ validateBeforeSave: false });

  if (isUserBlock) {
    return next(
      new AppError(
        `此帳戶嘗試多次登入請等待 ${loginFeature.printWattlingTime(
          user,
          60 * 60 * 1000
        )} 分鐘`,
        401
      )
    );
  }

  if (user && isCorrectPassword) {
    user.tryLoginCount = 0;
    await user.save({ validateBeforeSave: false });
    sendJwtToClient(user, 201, req, res);
  } else {
    await user.save({ validateBeforeSave: false });
    return next(new AppError('登入失敗！， 請從新確認 email 或 password', 401));
  }
});

//用戶更新密碼
exports.updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, password, passwordConfirm } = req.body;
  if (!currentPassword || !password || !passwordConfirm) {
    return next(new AppError('請確認是否有未填欄位'), 401);
  }
  const user = await User.findById(req.user.id).select('+password');
  if (!user) return next(new AppError('用戶已被註銷，請重新登入！'), 403);

  const isCorrectPassword = await user?.correctPassword(
    currentPassword, // 用戶輸入密碼
    user.password //MongoDB 上 bcrypt 加密密碼
  );

  if (!password || !isCorrectPassword)
    return next(new AppError('請確認輸入密碼是否正確', 401));

  if (password !== passwordConfirm)
    return next(new AppError('請確認輸入更改密碼與確認更改密碼是否一致', 401));

  //save newPassword
  user.password = password;
  user.passwordConfirm = passwordConfirm;

  await user.save();

  sendJwtToClient(user, 200, req, res);
});

//
exports.forgetPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) return next(new AppError('此帳戶不存在', 404));
  const resetToken = user.createPasswordResetToken();

  await user.save({ validateBeforeSave: false });

  //3.Send it to user's email
  const resetURL = `${
    process.env?.[
      `${
        process.env.NODE_ENV === 'production'
          ? 'FRONT_END_SERVER'
          : 'FRONT_END_LOCAL'
      }`
    ]
  }/Exhibition-front-end/#/resetPassword/${resetToken}`;

  try {
    await new Email(user, resetURL).sendResetPassword();
    res.status(200).json({
      status: 'success',
      message: '已發送Token 至信箱',
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    return next(new AppError('發送郵件發生錯誤，請重新嘗試！'), 500);
  }
});

exports.checkResetToken = catchAsync(async (req, res, next) => {
  const resetToken = req.params?.token;
  const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  //get Token a
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) return next(new AppError('更改密碼信件到期，請重新嘗試'), 400);

  res.status(200).json({
    status: 'success',
    message: '信件加密正確, 並在期間內！',
  });
});

//user reset password.
exports.resetPassword = catchAsync(async (req, res, next) => {
  //compare token
  const resetToken = req.params.token;
  const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) return next(new AppError('更改密碼信件到期，請重新嘗試'), 400);

  //完成密碼更改
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined; //重置ResetToken
  user.passwordResetExpires = undefined; //重置ResetExpires

  await user.save(); //?? [FIX]

  res.status(200).json({
    status: 'success',
    message: '密碼更改成功！',
  });
});
