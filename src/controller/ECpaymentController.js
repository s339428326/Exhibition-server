const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const crypto = require('crypto');
const ecpay_payment = require('ecpay_aio_nodejs');

const { MERCHANTID, HASHKEY, HASHIV, HOST } = process.env;
const options = {
  OperationMode: 'Test', //Test or Production
  MercProfile: {
    MerchantID: MERCHANTID,
    HashKey: HASHKEY,
    HashIV: HASHIV,
  },
  IgnorePayment: [
    //    "Credit",
    //    "WebATM",
    //    "ATM",
    //    "CVS",
    //    "BARCODE",
    //    "AndroidPay"
  ],
  IsProjectContractor: false,
};

const MerchantTradeDate = new Date().toLocaleString('zh-TW', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
  timeZone: 'UTC',
});

exports.createECOrder = catchAsync(async (req, res, next) => {
  const { title, total } = req.body;

  const uid = crypto.randomBytes(10).toString('hex');

  //基本參數設置
  let base_param = {
    MerchantTradeNo: uid, //請帶20碼uid, ex: f0a0d7e9fae1bb72bc93
    MerchantTradeDate, //ex: 2017/02/13 15:45:30
    TotalAmount: '100',
    TradeDesc: '測試交易描述',
    ItemName: '測試商品等#測試商品2', //商品名稱，若有多筆，需在金流選擇頁 一行一行顯示, 商品名增請以#字號分開
    // OrderResultURL: `${
    //   process.env.NODE_ENV === 'development'
    //     ? process.env.FRONT_END_LOCAL
    //     : process.env.FRONT_END_SERVER
    // }/#/`,
    ReturnURL: `https://evening-hollows-08215-2bb8e1b9252d.herokuapp.com/api/v1/ec/checkMAC`, //API TO CHECK MAC
    ClientBackURL: `${
      process.env.NODE_ENV === 'development'
        ? process.env.FRONT_END_LOCAL
        : process.env.FRONT_END_SERVER
    }/`,
    // ChooseSubPayment: '',
    // NeedExtraPaidInfo: '1',
    // ItemURL: 'http://item.test.tw',
    // Remark: '交易備註',
    // HoldTradeAMT: '1',
    // StoreID: '',
    // CustomField1: '',
    // CustomField2: '',
    // CustomField3: '',
    // CustomField4: ''
  };

  const create = new ecpay_payment(options);
  const html = create.payment_client.aio_check_out_all(base_param);

  res.status(200).json({
    url: `${
      process.env.NODE_ENV === 'development'
        ? process.env.FRONT_END_LOCAL
        : process.env.FRONT_END_SERVER
    }/payment`,
    html,
  });
});

exports.checkMac = catchAsync(async (req, res, next) => {
  console.log('req.body:', req.body);

  const { CheckMacValue } = req.body;
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

  // 交易成功後，需要回傳 1|OK 給綠界
  res.send('1|OK');

  // 用戶交易完成後的轉址
  //   router.get('/clientReturn', (req, res) => {
  //     console.log('clientReturn:', req.body, req.query);
  //     res.render('return', { query: req.query });
  //   });
});
