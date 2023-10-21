const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const globalErrorHandler = require('./src/controller/errorController');

dotenv.config({ path: 'config.env' });
const mongoDB = require('./src/mongoDB');
const api = require('./src/routes/index');

const app = express();

//HTML template lng for email
app.set('views', `${__dirname}/views`);
app.set('view engine', 'ejs');

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

mongoDB();

app.use(cors());
app.use(express.json({ limit: '2mb' })); //req 超過2mb 會停止回應
app.use(express.urlencoded({ extended: false })); //解析外部回傳, extended:false禁止外部使用字串query DB

//using react build static File
app.use(express.static('public'));

//api routes
app.use('/api/v1', api);

app.use(globalErrorHandler);

const port = process.env.PORT || 3000;

app.listen(port, () =>
  console.log(
    `NODE_ENV=${
      process.env.NODE_ENV
    }\n後端登入位置:http://localhost:3000\nApplication Start Port:${port}\n前端主機位置抓取：${
      process.env.NODE_ENV === 'production'
        ? process.env?.FRONT_END_SERVER
        : process.env?.FRONT_END_LOCAL
    }`
  )
);

module.exports = app;
