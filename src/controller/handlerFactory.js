//CRUD Fac.
const AppError = require('../utils/AppError');
const APIFeatures = require('../utils/APIFeatures');
const catchAsync = require('../utils/catchAsync');
const imgur = require('../utils/imgurHandler');
//Get All
exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    //若想要輸出 model 名稱可以使用 modelName
    const modelName = Model.modelName.toLowerCase();

    const features = new APIFeatures(Model.find(), req.query)
      .searchModel()
      .filter()
      .limitField()
      .pagination();
    //   .sort()

    //執行query
    const doc = await features.ModelFindQuery;

    res.status(200).json({
      status: 'success',
      results: doc.length,
      [`${modelName}Data`]: doc,
    });
  });

//Get one
exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    //給外部函示參數設定populate 可用選項
    let query = Model.findById(req.params.id);
    if (populateOptions) query = query.populate(populateOptions);

    //排除 mongoDB version field
    const doc = await query.select('-__v');

    if (!doc) {
      return next(new AppError(`Not Found id:${req.params.id} Model`, 404));
    }
    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });

//create
exports.create = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(200).json({
      requestAt: req.requestTime,
      status: 'success',
      data: doc,
    });
  });

//patch
exports.patchOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const modelName = Model.modelName.toLowerCase();
    let data = req.body;

    const doc = await Model.findByIdAndUpdate(req.params.id, data, {
      //選項指定當更新完成後，是否回傳更新後的文件，預設為 false，若設定為 true 則會回傳更新後的文件。
      new: true,
      //預設為 false。如果你的 Schema 設定了驗證器（Validators），在更新文件時可能會需要執行驗證器以確認新資料是否符合欄位的限制條件，此時需要將 runValidators 設定為 true。如果更新的資料不符合欄位的限制條件，就會拋出驗證錯誤。
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError(`Not Found id:${req.params.id}`, 404));
    }
    res.status(200).json({
      status: 'success',
      [modelName]: doc,
    });
  });

//delete
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError(`Not Found id:${req.params.id} Model`, 404));
    }

    res.status(204).json({
      status: 'success',
      message: '已接收到訊息, 但未成功刪除項目',
    });
  });
