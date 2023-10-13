//
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const loginFeature = require('../utils/loginFeature');
//
const { sendJwtToClient } = require('../controller/authController');
//
const User = require('../model/userModel');

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

  //   [Feature] 整理login Api
  if (user?.role === 'user') {
    return next(
      new AppError('登入失敗！， 請從新確認 email 或 password-(2)', 400)
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
    return next(new AppError('登入失敗！， 請從新確認 email 或 password', 401));
  }
});
