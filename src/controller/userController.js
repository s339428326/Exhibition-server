const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const handlerFactory = require('./handlerFactory');
const User = require('../model/userModel');

//暫時不使用在後端上傳imgur
exports.uploadImage = (keyName) =>
  catchAsync(async (req, res, next) => {
    const { authorization } = req.headers;
    const token = authorization?.split(' ')[1];

    const { id } = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    if (!id) return next(new AppError('用戶憑證到期或不存在', 404));

    const user = await User.findById(id);
    if (!user) return next(new AppError(`請確認目前用戶狀態`, 403));

    //size
    const contentLength = req.get('Content-Length');
    if (contentLength > 3145728)
      return next(new AppError('圖片過大請勿大於2MB', 404));

    const base64 = req.body?.[keyName].split(',')[1];

    if (!base64) return next(new AppError('找不到圖片檔案', 404));

    const ImageResponse = await client.upload({
      type: 'base64',
      image: base64,
      album: process.env.IMGUR_ALBUM,
    });

    if (ImageResponse.status === 400)
      return next(new AppError('上傳超時請重新嘗試', 408));

    // [BUG] 不會刪除舊圖片
    if (user[keyName].deleteHash.length > 0) {
      const deleteImgurResponse = await client.deleteImage(
        user.avatar.deleteHash
      );
    }

    user[keyName] = {
      imageUrl: ImageResponse.data.link,
      deleteHash: ImageResponse.data.deletehash,
    };

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      data: {
        user,
        message: `${keyName}更新成功`,
      },
    });
  });

//role for admin
exports.getAllUsers = handlerFactory.getAll(User);
exports.getUser = handlerFactory.getOne(User);
exports.createUser = handlerFactory.create(User);
exports.patchUser = handlerFactory.patchOne(User);
exports.deleteUser = handlerFactory.deleteOne(User);

//取消最愛展覽
exports.deleteTrackExhibition = catchAsync(async (req, res, next) => {
  const { _id } = req?.user;
  const user = await User.findById(_id);
  if (!user) return next(new AppError('請確認User 是存在', 403));
  if (!user.trackList.find((it) => `${it?._id}` === req?.params?.id))
    return next(new AppError('此展覽不存在於展覽列表中', 403));

  user.trackList = user.trackList.filter(
    (item) => `${item?._id}` !== req?.params?.id
  );

  user.save({ validateBeforeSave: true });

  res.status(200).json({
    status: 'success',
    message: `delete ${_id}`,
  });
});

// 取得用戶所有最愛展覽資料
exports.getUserTrackList = catchAsync(async (req, res, next) => {
  const { _id } = req?.user;
  const user = await User.findById(_id);
  if (!user) return next(new AppError('請確認User 是存在', 403));

  res.status(200).json({
    status: 'success',
    data: user.trackList,
  });
});

//新增用戶最愛展覽
exports.addTrackExhibition = catchAsync(async (req, res, next) => {
  const { _id } = req?.user;
  const user = await User.findById(_id);
  if (!user) return next(new AppError('請確認User 是存在', 403));
  if (user.trackList.includes(req?.params?.id))
    return next(new AppError('此展覽已存在', 403));
  user.trackList.push(req?.params?.id);

  user.save({ validateBeforeSave: true });

  res.status(200).json({
    status: 'success',
    data: user.trackList,
  });
});

//更個人 Email 暱稱
exports.updateOwnInfo = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm)
    return next(new AppError('請使用 /forgetPassword 路由來更改密碼'), 401);

  const filterBody = filterObj(req.body, 'name', 'email');

  //   if (req.file) filterBody.photo = req.file.filename;

  const updateUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true, //
    runValidators: true,
  }).select('-passwordChangedAt -__v');

  if (!updateUser)
    return next(new AppError('此用戶已不存在, 請重新登入！', 400));

  res.status(200).json({
    status: 'success',
    data: {
      user: updateUser,
    },
  });
});

// 凍結帳戶
exports.deleteOwnAccount = catchAsync(async (req, res, next) => {
  //發送驗證碼至信箱
  //等待

  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    message: '已成功刪除用戶!',
  });
});
