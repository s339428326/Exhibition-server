const express = require('express');

const router = express.Router();

const userRouter = require('./routes/userRoutes');
const exhibitionRouter = require('./routes/exhibitionRoute');
const orderRouter = require('./routes/orderRoute');
const startRouter = require('./routes/startRoute');
const authRouter = require('./routes/authRoute');
const ticketRouter = require('./routes/ticketRoutes');
const ecRouter = require('./routes/ecRoutes');

router.use('/user', userRouter);
router.use('/auth', authRouter);
router.use('/exhibition', exhibitionRouter);
router.use('/order', orderRouter);
router.use('/ticket', ticketRouter);
router.use('/ec', ecRouter);

exports.router;
