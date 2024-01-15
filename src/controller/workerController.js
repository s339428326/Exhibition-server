//公司員工控制
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const generatePassword = require('../utils/generatePassword');
const handlerFactory = require('./handlerFactory');

const Worker = require('../model/workerModel');
const Department = require('../model/departmentModel');

exports.getWorker = handlerFactory.getOne(Worker, 'department');

exports.updateWorker = catchAsync(async (req, res, next) => {
  const { name, department, position } = req?.body;
  if (!name || !department || !position)
    return next(new AppError('請確認單資料', 404));

  const worker = await Worker.findById(req?.params?.id);
  if (!worker) return next(new AppError('員工資料更新失敗', 404));

  if (worker.department !== department) {
    //del old Dep.
    await Department.findByIdAndUpdate(worker.department, {
      $pull: { member: worker._id },
    });
    //add new Dep.
    await Department.findByIdAndUpdate(department, {
      $addToSet: { member: worker._id },
    });
  }

  worker.name = name;
  worker.position = position;
  worker.department = department;

  worker.save({ validateBeforeSave: true });

  return res.status(200).json({
    status: 'success',
    data: worker,
  });
});

exports.getAllWorker = catchAsync(async (req, res, next) => {
  const worker = await Worker.aggregate([
    {
      $lookup: {
        from: 'departments',
        localField: 'department',
        foreignField: '_id',
        as: 'department',
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: worker,
  });
});

exports.createWorker = catchAsync(async (req, res, next) => {
  //確認表單
  const { name, email, position, department } = req.body;
  if (!name || !email || !position || !department)
    return next(new AppError('表單傳送失敗!, 請通知資訊室', 404));

  //是否超過最大員工人數
  const departmentDoc = await Department.findById(department);
  const workerList = await Worker.find({ department });

  if (workerList.length >= departmentDoc.memberCount)
    return next(new AppError('該部門已到達最大人數', 404));

  const password = generatePassword(10);

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

exports.deleteWorker = catchAsync(async (req, res, next) => {
  const worker = await Worker.findByIdAndDelete(req?.params?.id);
  if (!worker) return next(new AppError('找不到此員工', 400));
  const department = await Department.findById(worker?.department);

  department.member = department.member.filter((it) => {
    return it?._id.toString() !== req?.params?.id;
  });

  department.save({ validateBeforeSave: true });

  res.status(200).json({
    status: 'success',
    message: 'delete worker Done!',
  });
});

//更改user 後台網頁管理權限
exports.changeRole = catchAsync(async (req, res, next) => {
  const { role } = req.body;
  const worker = await Worker.findByIdAndUpdate(
    req.params?.id,
    {
      role,
    },
    { new: true }
  );
  if (!worker) return next(new AppError('找不到用戶', 404));

  res.status(200).json({
    status: 'success',
    message: `已成功授權, ${worker.role} 身份！`,
  });
});

//
exports.changeActive = catchAsync(async (req, res, next) => {
  const worker = await Worker.findById(req.params?.id);
  if (!worker) return next(new AppError('錯誤找不到該用戶', 404));
  worker.isActive = !worker.isActive;
  worker.save({ validateBeforeSave: true });

  //find department to toggle member array
  await Department.findByIdAndUpdate(
    worker.department,
    worker.isActive
      ? { $addToSet: { member: worker._id } }
      : { $pull: { member: worker._id } }
  );

  //older using js to change mongoDB methods
  // const department = await Department.findById(worker.department);
  // if (!department) return next(new AppError('目前此員工無設置部門', 404));

  // if (worker.isActive) {
  //   department.member.push(worker._id);
  // } else {
  //   department.member = department.member.filter((it) => it === worker._id);
  // }
  // department.save({ validateBeforeSave: true });

  res.status(200).json({
    status: 'success',
    message: `用戶已${worker.isActive ? '開啟' : '關閉'}`,
  });
});
