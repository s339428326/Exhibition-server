const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId, // 購買人
    ref: 'User',
    required: true,
  },
  orderList: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Exhibition',
      ticket: { type: Object }, //選擇票種
    },
  ],
  time: {
    type: Date,
    required: true,
  },
});

//填充 User Model
orderSchema.pre(/^find/, (next) => {
  this.populate('user');
  this.populate('orderList');
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
