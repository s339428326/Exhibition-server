//綠界控制
const Order = require('../model/orderModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const ecpay_payment = require('ecpay_aio_nodejs');
const ecpayment = require('../utils/ecpayment');

//confirm Ec payment ReturnUrl
exports.checkMac = catchAsync(async (req, res, next) => {
  console.log('req.body:', req.body);
  const { CheckMacValue, MerchantTradeNo } = req.body;
  const data = { ...req.body };
  delete data.CheckMacValue; // 此段不驗證
  const create = new ecpay_payment(ecpayment.options);
  const checkValue = create.payment_client.helper.gen_chk_mac_value(data);
  console.log(
    '確認交易正確性：',
    CheckMacValue === checkValue,
    CheckMacValue,
    checkValue
  );
  if (CheckMacValue === checkValue) {
    // 交易成功後，需要回傳 1|OK 給綠界
    const order = await Order.findOne({ MerchantTradeNo: MerchantTradeNo });
    order.isPay = true;
    await order.save({ validateBeforeSave: true });
    console.log('Find- Test Order:', order);
    res.send('1|OK');
  } else {
    return next(new AppError('訂單未成功付款, 請通知後台人員！', 404));
  }
});
