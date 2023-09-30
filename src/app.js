const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');

const globalErrorHandler = require('./controller/errorController');

//env
dotenv.config({ path: 'config.env' });

//router
const userRouter = require('./routes/userRoutes');
const exhibitionRouter = require('./routes/exhibitionRoute');
const orderRouter = require('./routes/orderRoute');
const startRouter = require('./routes/startRoute');
const authRouter = require('./routes/authRoute');
const ticketRouter = require('./routes/ticketRoutes');
const ecRouter = require('./routes/ecRoutes');

const app = express();
app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(cors());
app.use(express.json({ limit: '2mb' })); //req 超過2mb 會停止回應

//Views Router
const router = express.Router();
app.post('/payment', (req, res) => {
  console.log(req.body);
  res.render('payment');
});

//API router
app.use('/api/v1/user', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/exhibition', exhibitionRouter);
app.use('/api/v1/order', orderRouter);
app.use('/api/v1/ticket', ticketRouter);
app.use('/api/v1/ec', ecRouter);

//特殊需求(heroku 喚醒)
app.use('/api/v1/start', startRouter);

//
app.use(globalErrorHandler);

module.exports = app;
