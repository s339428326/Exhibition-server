//錯誤控制
const AppError = require('../utils/AppError');

//開發模式(process.env.NODE_ENV = development)
const sendErrorDev = (err, req, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

//產品模式(process.env.NODE_ENV = development)
const sendErrorProd = (err, req, res) => {
  //常規預期錯誤，並客製化的error回傳客戶端的訊息
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  //如果發生不可預期錯誤會回傳以下狀態(須記錄log)
  console.error(`[ERROR LOG]`, err);
  return res.status(500).json({
    status: 'err',
    message: '發生不可預期的錯誤，目前為開發版本未設有回報功能',
  });
};

//error middleware
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    //新增預期錯誤

    //檔案過大
    if (err.type === 'entity.too.large') {
      return sendErrorProd(new AppError('檔案過大'), req, res);
    }

    //ValidatorError (mongoose schema error):schema fields errors
    //User validation failed
    if (/validation failed$/.test(err._message)) {
      const errorDuplicate = {};

      Object.entries(err.errors).forEach(([name, errorObj]) => {
        errorDuplicate[name] = errorObj.properties.message;
      });

      return res.status(401).json({
        status: 'fail',
        message: '填寫表單中有錯誤請確認',
        errors: errorDuplicate,
      });
    }

    //E11000 duplicate key error
    if (err.code === 11000) {
      //未使用Hook From res 使用物件形式

      // const errors = {};
      // const fieldsString = Object.keys(err.keyValue).forEach((keyname) => {
      //   errors[keyname] = `${keyname}已被使用，請重新填寫！`;
      // });

      // return res.status(400).json({
      //   status: 400,
      //   errors,
      // });

      //重複錯誤使用res str
      let message = '';
      const fieldsString = Object.keys(err.keyValue).forEach((keyname) => {
        message += `${keyname},`;
      });
      message += '已被使用，請重新填寫！';

      return res.status(400).json({
        status: 400,
        message,
      });
    }

    if (err.name === 'JsonWebTokenError') {
      return sendErrorProd(new AppError('Token 錯誤', 403), req, res);
    }

    if (err.name === 'CastError' && err.kind === 'ObjectId') {
      return sendErrorProd(new AppError('Id 錯誤請確認', 403), req, res);
    }

    //[Testing] prod 中可以看到錯誤內容
    sendErrorDev(err, req, res);

    //[open]
    // sendErrorProd(err, req, res);
  }
};
