//bcrypt加密
const bcrypt = require('bcrypt');

/**
 *
 * @param {*} model 代入使用schema
 *
 * 針對使用schema 添加 欄位：
 *  password
 *  passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
 */

/**
    範例：
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
    }
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
 */

module.exports = function useAuth(model) {
  //auth
  //儲存進MongoDb前，對password 欄位加密
  model.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
  });

  //model.pre
  // 當用戶改變密碼，更新passwordChangedAt 屬性
  model.pre('save', function (next) {
    //如果用戶 未更新密碼 或 新增新帳戶 則跳出倒下一個middleware
    if (!this.isModified('password') || this.$isNew) return next();

    //如果更新過則重置到當前時間
    //issue(永遠被判定密碼已被更改) => changePasswordAt > jsonWebToken time(實際運作有機會)
    //儲存資料的時間DataBase 的時間會慢於JsonWebToken傳遞給用戶的時間(修正秒數1秒)
    this.passwordChangedAt = Date.now() - 1000;

    next();
  });
};
