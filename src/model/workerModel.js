//公司員工
const mongoose = require('mongoose');
const validator = require('validator');
const useAuth = require('../preHook/useAuth');

const workerSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      require: true,
    },
    department: {
      type: mongoose.Schema.ObjectId,
      ref: 'Department',
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
      default: 'normal',
      required: true,
      enum: {
        // 員工, 經理, 最高管理
        values: ['normal', 'manger', 'admin'],
        message: '出現錯誤權限用戶',
      },
    },
    isActive: {
      type: Boolean,
      select: false,
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
  },
  {
    strict: true, //(重要)除了設計中的資料欄位，其他不會儲存到MongoDB中
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

useAuth(workerSchema);
const Worker = mongoose.model('Worker', workerSchema);

module.exports = Worker;
