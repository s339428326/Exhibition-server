const mongoose = require('mongoose');

const exhibitionSchema = mongoose.Schema(
  {
    //名稱
    name: {
      type: String,
      required: true,
    },
    //展覽種類
    type: {
      type: String,
      required: true,
    },
    //開始時間
    startDate: {
      type: Date,
      required: true,
    },
    //結束時間
    endDate: {
      type: Date,
      required: true,
    },
    //image
    image: {
      type: String,
      default: '',
    },
    //展覽介紹
    introduce: {
      type: String,
    },
    // 票種
    tickGroup: [{ ticketType: String, price: Number }],
    location: {
      address: {
        type: String,
        required: true,
      },
    },
    //記錄瀏覽次數
    viewer: {
      type: Number,
      default: 0,
    },
  },
  {
    toJSON: { virtuals: true },
  }
);

exhibitionSchema.virtual('active').get(function () {
  const now = new Date();
  return this.startDate <= now && now <= this.endDate;
});

const Exhibition = mongoose.model('Exhibition', exhibitionSchema);

module.exports = Exhibition;
