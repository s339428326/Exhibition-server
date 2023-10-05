const crypto = require('crypto');

exports.options = {
  OperationMode: 'Test', //Test or Production
  MercProfile: {
    MerchantID: process.env.MERCHANTID,
    HashKey: process.env.HASHKEY,
    HashIV: process.env.HASHIV,
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

exports.genBaseParam = (TotalAmount, TradeDesc, ItemName) => {
  //MerchantTradeDate Ex: 2017/02/13 15:45:30
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

  //基本參數設置
  let base_param = {
    MerchantTradeNo: crypto.randomBytes(10).toString('hex'), //請帶20碼uid, ex: f0a0d7e9fae1bb72bc93
    MerchantTradeDate, //ex: 2017/02/13 15:45:30
    TotalAmount,
    TradeDesc,
    ItemName, //商品名稱，若有多筆，需在金流選擇頁 一行一行顯示, 商品名增請以#字號分開
    // OrderResultURL: `${
    //   process.env.NODE_ENV === 'development'
    //     ? process.env.FRONT_END_LOCAL
    //     : process.env.FRONT_END_SERVER
    // }/#/`,
    // https://evening-hollows-08215-2bb8e1b9252d.herokuapp.com/api/v1/ec/checkMAC
    ReturnURL: `${process.env.HOST}/api/v1/ec/checkMAC`, //API TO CHECK MAC
    ClientBackURL: `${
      process.env.NODE_ENV === 'development'
        ? process.env.FRONT_END_LOCAL
        : process.env.FRONT_END_SERVER
    }/#/payment/confirm`,
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

  return base_param;
};
