const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    required: true,
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
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
