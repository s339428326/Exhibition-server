const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const handlerFactory = require('../controller/handlerFactory');
const Department = require('../model/departmentModel');
const Worker = require('../model/workerModel');

exports.createDepartment = handlerFactory.create(Department);
exports.getAllDepartment = handlerFactory.getAll(Department);
exports.getDepartment = handlerFactory.getOne(Department);

//新增部門職位
exports.createDepartmentPosition = catchAsync(async (req, res, next) => {
  const { name } = req.body;
  if (!name) return next(new AppError('請確認表單是否填寫職位名稱 name', 404));

  const department = await Department.findById(req.params.id);

  // const department = await Department.findByIdAndUpdate(
  //   req?.params?.id,
  //   {
  //     $addToSet: { position: { name: name, value: name } },
  //   },
  //   { new: true }
  // );

  if (department.position.find((it) => it.name === name))
    return next(new AppError('請確認是否有重複職位名稱', 403));

  department.position = [...department.position, { name, value: name }];

  department.save({ validateBeforeSave: true });

  res.status(200).json({
    status: 'success',
    message: `department ${department.name}, add position:${name}, Done!`,
  });
});

// 更改部門職位
exports.patchDepartmentPosition = catchAsync(async (req, res, next) => {
  const { oldName, newName } = req.body;
  console.log(oldName, newName);
  if (!oldName || !newName)
    return next(new AppError('請確認是填入oldName, newName', 403));
  if (!req.params?.id) return next(new AppError('請確認 params /:id', 403));
  const department = await Department.findById(req.params.id);

  if (department.find((it) => it.name === newName))
    return next(new AppError('輸入職位已重複', 403));

  const newPosition = department.position.map((it) =>
    it.name === oldName ? { name: newName, value: newName } : it
  );

  department.position = newPosition;

  department.save({ validateBeforeSave: true });

  res.status(200).json({
    status: 'success',
    department,
  });
});

// 刪除部門職位
exports.deleteDepartmentPosition = catchAsync(async (req, res, next) => {
  const { position } = req.body;
  console.log(req.body);
  if (!position) return next(new AppError('請輸入req.body.position', 403));
  const department = await Department.findById(req.params.id);

  department.position = department.position.filter(
    (it) => it.name !== position
  );

  department.save({ validateBeforeSave: true });

  res.status(200).json({
    status: 'success',
    data: department,
  });
});
