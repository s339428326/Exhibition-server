//公司員工
const mongoose = require('mongoose');
const validator = require('validator');

const platformEmailSchema = new mongoose.Schema(
  {
    //建立者
    creator: {
      type: mongoose.Types.ObjectId,
      ref: 'Worker',
      required: [true, '請輸入寄件人'],
    },
    type: {
      type: String,
      default: '其他',
    },
    //是否審核通過
    isApproved: {
      type: Boolean,
      default: false,
    },
    //審核人
    checker: {
      type: mongoose.Types.ObjectId,
      ref: 'Worker',
    },
    //標題
    subject: {
      type: String,
      required: [true, '請輸入信件名稱'],
    },
    //內容
    content: {
      type: String,
      required: [true, '請輸入信件內容'],
    },
    //建立日期
    createAt: {
      type: Date,
      default: () => new Date(),
    },
    //審核日期
    sendAt: {
      type: Date,
    },
  },
  {
    strict: true, //(重要)除了設計中的資料欄位，其他不會儲存到MongoDB中
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//mongoose 嵌入資料速度太慢
platformEmailSchema.pre(/^find/, function () {
  this.populate('creator');
  this.populate('checker');
});

const PlatformEmail = mongoose.model('PlatformEmail', platformEmailSchema);

module.exports = PlatformEmail;
