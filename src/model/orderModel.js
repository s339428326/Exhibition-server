//訂單與展覽票
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const orderSchema = new mongoose.Schema(
  //[Feature] 進出場QR code 設計
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    MerchantTradeNo: {
      type: String,
    },
    name: String,
    address: String,
    phone: String,
    total: Number,
    isPay: {
      type: Boolean,
      default: true, //[FIX] 這裡應為false, 因為串接綠界測試服務有機率失敗, 先設置為true
    },
    orderList: [
      {
        id: String,
        name: String,
        startDate: Date,
        endDate: Date,
        image: String,
        ticketType: Object,
        price: Number,
        quantity: Number,
        qrcode: {
          type: String,
          // default: function () {
          //   return jwt.sign({ ticketId: this._id }, process.env?.TICKET_SECRET);
          // },
        },
        ticketState: {
          type: String,
          enum: ['unused', 'using', 'used'], //未使用, 使用中, 已使用
          default: 'unused',
        },
      },
    ],
    createAt: {
      type: Date,
      default: new Date(),
    },
  },
  {
    strict: true, //(重要)除了設計中的資料欄位，其他不會儲存到MongoDB中
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
