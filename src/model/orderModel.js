const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
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
      default: false,
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
        isAvailable: {
          type: Boolean,
          default: true,
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
