const Order = require('../model/orderModel');

const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const ecpay_payment = require('ecpay_aio_nodejs');

//confirm Ec payment ReturnUrl
exports.checkMac = catchAsync(async (req, res, next) => {
  console.log('req.body:', req.body, res);

  const { CheckMacValue, MerchantTradeNo } = req.body;
  const data = { ...req.body };
  delete data.CheckMacValue; // 此段不驗證

  const create = new ecpay_payment(options);
  const checkValue = create.payment_client.helper.gen_chk_mac_value(data);

  console.log(
    '確認交易正確性：',
    CheckMacValue === checkValue,
    CheckMacValue,
    checkValue
  );

  if (CheckMacValue === checkValue) {
    // 交易成功後，需要回傳 1|OK 給綠界
    const order = await Order.find({ MerchantTradeNo: MerchantTradeNo });
    order.isPay = true;
    await order.save({ validateBeforeSave: true });
    res.send('1|OK');
  } else {
    return;
  }
});
