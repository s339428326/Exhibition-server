const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

//SitePerson(現場人員)
exports.createSitePerson = catchAsync(async (req, res, next) => {
  const {} = req.body;

  res.status(200).json({
    status: 'success',
  });
});
