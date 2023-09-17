const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  localId: {
    type: String,
    required: true,
  },
  name: String,
  address: String,
  tel: String,
  total: Number,
  orderList: [
    {
      id: String,
      name: String,
      startDate: Date,
      endDate: Date,
      image: String,
      tickType: {
        price: Number,
        tickType: String,
      },
      price: Number,
      quantity: Number,
    },
  ],
  createAt: {
    type: Date,
    default: new Date(),
  },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
