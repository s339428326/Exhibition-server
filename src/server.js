const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');

const app = require('./app');

dotenv.config({ path: 'config.env' });

const port = process.env?.PORT || 7302;

const db = mongoose.connection;

mongoose.connect(
  process.env.DATABASE.replace('<password>', process.env.DB_PASSWORD),
  {
    useNewUrlParser: true,
  }
);

db.on('error', () => console.log('DateBase 連結失敗！'));
db.on('open', () => console.log('DateBase 連結成功！'));

const server = app.listen(port, () =>
  console.log(
    `NODE_ENV=${
      process.env.NODE_ENV
    }\nApplication Start Port:${port}\n前端主機位置抓取：${
      process.env.NODE_ENV === 'production'
        ? process.env?.FRONT_END_SERVER
        : process.env?.FRONT_END_LOCAL
    }`
  )
);
