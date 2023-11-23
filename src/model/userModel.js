//用戶
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const useAuth = require('../preHook/useAuth');
//[Feature] crypto methods remove to until common obj
/**
 * utils -> cryptoMethods
 * const commonMethods = {
  methodName1() {
    //...
  },
  methodName2() {
    // ...
  },
  // 添加其他共享方法...
};

  Schema:
  Object.assign(userSchema.methods, commonMethods);
 */

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      minLength: [2, '暱稱請勿小於2字元'],
      maxLength: [20, '暱稱請勿超過20字元'],
      default: function () {
        return this.email.split('@')[0];
      },
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      validate: [validator.isEmail, '請輸入有效信箱格式'],
      required: [true, '使用者必須包含email'],
    },
    avatar: {
      imageUrl: {
        type: String,
        default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
      },
      deleteHash: {
        type: String,
        default: '',
      },
    },
    phone: {
      type: String,
    },
    role: {
      type: String,
      default: 'user',
      required: true,
      enum: {
        // 用戶, 檢票人員, 主辦人, 後台管理權限
        values: ['user', 'inspector', 'host', 'admin'],
        message: '出現錯誤權限用戶',
      },
    },
    isActive: {
      type: Boolean,
      default: true,
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
    intro: {
      type: String,
      maxLength: [160, '自我介紹請勿超過160個字元'],
      default: '目前沒有自我介紹',
      trim: true,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    tryLoginCount: {
      type: Number,
      default: 0,
    },
    tryLoginTime: {
      type: Date,
    },
    trackList: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Exhibition',
      },
    ],
  },
  {
    strict: true, //(重要)除了設計中的資料欄位，其他不會儲存到MongoDB中
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//auth pre hook
useAuth(userSchema);

//schema methods
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

//更改密碼後， 確認JWT Token 是否需要更換
userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  //如果passwordChangedAt存在，密碼被更換過
  if (this.passwordChangedAt) {
    //JS系統採毫秒制需要除1000
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    //判斷 更換密碼時間 是否大於 JWTToken憑證起始時間(decode.iat)
    return changedTimestamp > JWTTimeStamp;
  }

  //密碼從未被更改過
  return false;
};

//建立Password Reset Token
userSchema.methods.createPasswordResetToken = function () {
  //Step.1 建立重置Token使用隨機Bytes(16進制)產出, 並給予信件此Token
  const resetToken = crypto.randomBytes(32).toString('hex');

  //Step.2
  //使用加密SHA256(16進制)Token儲存於MongoDB(安全性)
  //用於信件比對Token使用同樣加密比對是否一樣
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  //Step.3
  //建立有效期限為10分鐘
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  //Step.4
  //回傳未加密重置 resetToken
  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
