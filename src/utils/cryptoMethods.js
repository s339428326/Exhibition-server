const bcrypt = require('bcrypt');
const crypto = require('crypto');

const cryptoMethods = {
  correctPassword: async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
  },
  //更改密碼後， 確認JWT Token 是否需要更換
  changedPasswordAfter: function (JWTTimeStamp) {
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
  },
  //建立Password Reset Token
  createPasswordResetToken: function () {
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
  },
};

module.exports = cryptoMethods;
