//用戶
const mongoose = require('mongoose');
const validator = require('validator');
const useAuth = require('../preHook/useAuth');
const cryptoMethods = require('../utils/cryptoMethods');

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
Object.assign(userSchema.methods, cryptoMethods);

const User = mongoose.model('User', userSchema);

module.exports = User;
