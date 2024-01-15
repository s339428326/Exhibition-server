//展覽廠商
const mongoose = require('mongoose');
const validator = require('validator');
const useAuth = require('../preHook/useAuth');

const partnerSchema = new mongoose.Schema({
  username: {
    type: String,
    default: '未設置聯絡人名稱',
  },
  role: {
    type: String,
    enum: {
      //檢票人員, 主辦人
      values: ['host', 'inspector'],
      message: '出現錯誤權限用戶',
    },
  },
  company: {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    //插入展覽Data
    exhibition: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Exhibition',
      },
    ],
    //確認帳戶是否以被後台接受申請
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  password: {
    type: String,
    minLength: [8, '密碼請勿低於8個字元'],
    required: [true, '密碼為必填選項'],
    select: false,
    validate: [
      function (value) {
        return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value);
      },
      '密碼包含至少一個字母和一個數字，長度至少為8位',
    ],
  },
  confirmPassword: {
    type: String,
    required: [true, '請重新確認密碼'],
    validate: [
      function (value) {
        return this.password === value;
      },
      '請確認輸入密碼是否一致',
    ],
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

const Partner = mongoose.model('Partner', partnerSchema);

//未測試
partnerSchema.pre(/^find/, function (next) {
  this.exhibition.populate('Exhibition');
});

useAuth(partnerSchema);

module.exports = Partner;
