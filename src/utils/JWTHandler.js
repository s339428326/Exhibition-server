const jwt = require('jsonwebtoken');

module.exports = (id) => {
  if (!process.env.JWT_SECRET) throw new Error('dotenv 沒有設置JWT_SECRET');
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
