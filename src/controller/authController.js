const { promisify } = require('util');
const jwt = require('jsonwebtoken');

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

  const { id, iat } = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  const user = await User.findById(id);

  if (user?.changedPasswordAfter(iat))
    return next(new AppError('密碼已更改請重新嘗試登入', 403));

  req.user = user;

  next();
});

exports.isLogin = catchAsync(async (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization?.split(' ')[1];

  if (!token) return next(new AppError('已登出', 403));

  //2.compare token is correct
  const { id } = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const { email, avatar, cover, name, role, intro, cart, trackArtworkList } =
    await User.findById(id);
  if (!email) return next(new AppError('請確認用戶是否存在', 404));

  //3.res pass
  res.status(200).json({
    status: 'success',
    user: {
      email,
      avatar,
      cover,
      name,
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

  //未被建立返回 客製 Error
  if (!data) return next(new AppError('建立賬戶失敗 ！', 403));

  res.status(200).json({
    status: 'success',
    data,
  });
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

//忘記密碼(信箱功能) 未開發
exports.forgetPassword = catchAsync(async (req, res, next) => {});
