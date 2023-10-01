const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');

const globalErrorHandler = require('./controller/errorController');

//env
dotenv.config({ path: 'config.env' });

const api = require('./routes/index');

const app = express();
// app.set('view engine', 'ejs');
// app.set('views', `${__dirname}/views`);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.get('/', (req, res) => {
  res.send('<h1>Exhibition APIs Start!</h1>');
});

app.use(cors());
app.use(express.json({ limit: '2mb' })); //req 超過2mb 會停止回應

app.use('/api/v1', api);

//
app.use(globalErrorHandler);

module.exports = app;
