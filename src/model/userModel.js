const validator = require('validator');
//bcrypt加密
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const mongoose = require('mongoose');

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
        values: ['user', 'inspector', 'host', 'admin'], // 用戶, 檢票人員, 主辦人, 後台管理權限
        message: '出現錯誤權限用戶',
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
    intro: {
      type: String,
      maxLength: [160, '自我介紹請勿超過160個字元'],
      default: '目前沒有自我介紹',
      trim: true,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
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

//auth
//儲存進MongoDb前，對password 欄位加密
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;

  next();
});

// 當用戶改變密碼，更新passwordChangedAt 屬性
userSchema.pre('save', function (next) {
  //如果用戶 未更新密碼 或 新增新帳戶 則跳出倒下一個middleware
  if (!this.isModified('password') || this.$isNew) return next();

  //如果更新過則重置到當前時間
  //issue(永遠被判定密碼已被更改) => changePasswordAt > jsonWebToken time(實際運作有機會)
  //儲存資料的時間DataBase 的時間會慢於JsonWebToken傳遞給用戶的時間(修正秒數1秒)
  this.passwordChangedAt = Date.now() - 1000;

  next();
});

//比對 bcrypt 加密密碼 是否等與 填入密碼
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
