//驗證控制
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Email = require('../utils/email.js');

const AppError = require('../utils/AppError.js');
const catchAsync = require('../utils/catchAsync.js');
const loginFeature = require('../utils/loginFeature.js');
const singToken = require('../utils/JWTHandler.js');

const User = require('../model/userModel.js');

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

//JWT 保護Router, 若需要鎖定 role 需要搭配 restrictTo 一起使用
//router.use(authController.protect(Model),authController.restrictTo(['admin']))
exports.protect = (model) =>
  catchAsync(async (req, res, next) => {
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

    const user = await model.findById(id);

    if (user?.changedPasswordAfter(iat))
      return next(new AppError('密碼已更改請重新嘗試登入', 403));

    req.user = user;

    next();
  });

exports.authAndReturnUserData = (model) =>
  catchAsync(async (req, res, next) => {
    const { authorization } = req.headers;
    let token = authorization?.startsWith('Bearer')
      ? authorization?.split(' ')[1]
      : authorization;

    if (!token) return next(new AppError('已登出', 403));

    //2.compare token is correct
    const { id } = jwt.verify(token, process.env.JWT_SECRET);

    //check worker model
    const modelName = model.modelName.toLowerCase();
    if (modelName === 'worker') {
      const worker = await model.findById(id);
      return res.status(200).json({
        status: 'success',
        user: worker,
      });
    }

    const {
      email,
      avatar,
      cover,
      username,
      role,
      intro,
      cart,
      trackArtworkList,
    } = await model.findById(id);
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

exports.singUp = (model) =>
  catchAsync(async (req, res, next) => {
    const { email, password, confirmPassword } = req.body;

    if (!email || !password || !confirmPassword)
      return next(new AppError('註冊失敗！ 請確認內容是否填寫正確'));

    const data = await model.create({
      email,
      password,
      confirmPassword,
    });

    //[Feature] 針對公司員工, 添加額外mail Template
    if (model.modelName.toLowerCase() === 'user') {
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
      ).sendWelcome(data?.email);
    }

    //未被建立返回 客製 Error
    if (!data) return next(new AppError('建立賬戶失敗 ！', 403));

    sendJwtToClient(data, 200, req, res);
  });

exports.login = (roles, model) =>
  catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password)
      return next(
        new AppError('登入失敗！， 請從新確認 email 或 password'),
        400
      );

    const user = await model
      .findOne({ email })
      .select('+password +loginCount +loginTime +isActive');

    if (!user || !user.isActive)
      return next(new AppError('請重新確認信箱與密碼'), 404);

    const isCorrectPassword = await user?.correctPassword(
      password,
      user.password
    );

    if (!roles.includes(user.role)) {
      return next(
        new AppError(
          process.env.NODE_ENV === 'development'
            ? '請確認帳戶權限'
            : '請重新確認信箱與密碼',
          400
        )
      );
    }

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
      return next(
        new AppError('登入失敗！， 請從新確認 email 或 password', 401)
      );
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
    await new Email(user, resetURL).sendResetPassword(user?.email);
    res.status(200).json({
      status: 'success',
      message: '已發送Token 至信箱',
    });
  } catch (error) {
    console.log(error);
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

  if (!user) return next(new AppError('更改信件到期，請重新嘗試'), 400);

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

  if (!user) return next(new AppError('信件到期，請重新嘗試'), 400);

  //完成密碼更改
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined; //重置ResetToken
  user.passwordResetExpires = undefined; //重置ResetExpires

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    message: '密碼更改成功！',
  });
});

//user reset email.
exports.resetEmail = catchAsync(async (req, res, next) => {
  console.log(req.params.token);
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

  if (!user) return next(new AppError('信件到期，請重新嘗試'), 400);

  //確認修改信箱是否已存在於DateBase
  const checkEmailDataBase = await User.find({ email: req.body?.email });
  if (!checkEmailDataBase) return next(new AppError('此信箱以使用'), 403);

  //完成密碼更改
  user.email = req.body.email;

  user.passwordResetToken = undefined; //重置ResetToken
  user.passwordResetExpires = undefined; //重置ResetExpires

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    message: '信箱更改成功！',
  });
});

exports.changeEmail = catchAsync(async (req, res, next) => {
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
  }/Exhibition-front-end/#/changeEmail/${resetToken}`;

  try {
    await new Email(user, resetURL).sendChangeEmail(user?.email); //fix
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
