//最高權限資料控制
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

//model
const Worker = require('../model/workerModel');
const Department = require('../model/departmentModel');

exports.createWorker = catchAsync(async (req, res, next) => {
  //確認表單
  const { name, email, position, department, password } = req.body;
  if (!name || !email || !position || !department)
    return next(new AppError('表單傳送失敗!, 請通知資訊室', 404));

  //是否超過最大員工人數
  const departmentDoc = await Department.findById(department);
  const workerList = await Worker.find({ department });

  if (workerList.length >= departmentDoc.memberCount)
    return next(new AppError('該部門已到達最大人數', 404));

  const worker = await Worker.create({
    name,
    password,
    email,
    position,
    department,
  });

  departmentDoc.member.push(worker._id);
  departmentDoc.save({ validateBeforeSave: true });

  res.status(200).json({
    status: 'success',
    data: { worker, password },
  });
});
