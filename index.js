const dotenv = require('dotenv');
const mongoose = require('mongoose');

const app = require('./src/app');

dotenv.config({ path: 'config.env' });

const port = process.env.PORT || 8080;

const db = mongoose.connection;

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
});

// mongoose.connect(process.env.MONGODB_URI,{ useNewUrlParser: true,})

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
