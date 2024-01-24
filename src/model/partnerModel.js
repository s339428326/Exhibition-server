//展覽廠商
const mongoose = require('mongoose');
const validator = require('validator');
const cryptoMethods = require('../utils/cryptoMethods');
const useAuth = require('../preHook/useAuth');

const partnerSchema = new mongoose.Schema({
  //聯絡人
  name: {
    type: String,
    default: '未設置聯絡人名稱',
  },
  //帳戶權限
  role: {
    type: String,
    enum: {
      //檢票人員, 主辦人
      values: ['host'],
      message: '出現錯誤權限用戶',
    },
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  //合作意向
  comment: String,
  //公司資料
  company: {
    //名稱
    name: {
      type: String,
      maxLength: [12, '請勿超過12個字'],
      required: true,
    },
    //地址
    address: {
      type: String,
      required: [true, '請填入地址'],
    },
    //信箱
    email: {
      type: String,
      required: [true, '請填入信箱'],
    },
    //插入展覽Data
    exhibition: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Exhibition',
      },
    ],
    //確認帳戶是否以被後台接受申請
  },
  createAt: {
    type: Date,
    default: () => new Date(),
  },
  firstPassword: {
    type: String,
  },
  password: {
    type: String,
    minLength: [8, '密碼請勿低於8個字元'],
    select: false,
    validate: [
      function (value) {
        return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value);
      },
      '密碼包含至少一個字母和一個數字，長度至少為8位',
    ],
  },
  //審查帳戶人員
  checker: {
    type: mongoose.Schema.ObjectId,
    ref: 'Worker',
  },

  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

useAuth(partnerSchema);
Object.assign(partnerSchema.methods, cryptoMethods);

const Partner = mongoose.model('Partner', partnerSchema);

//未測試
partnerSchema.pre(/^find/, function (next) {
  this.exhibition.populate('Exhibition');
});

module.exports = Partner;
