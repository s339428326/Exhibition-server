const mongoose = require('mongoose');

const db = mongoose.connection;

module.exports = mongoDBConnect = () => {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
  });

  db.on('error', () => console.log('DateBase 連結失敗！'));
  db.on('open', () => console.log('DateBase 連結成功！'));
  console.log(location.port);
};
