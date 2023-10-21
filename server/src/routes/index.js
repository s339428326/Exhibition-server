const express = require('express');

const router = express.Router();

const userRouter = require('./userRoutes');
const exhibitionRouter = require('./exhibitionRoute');
const orderRouter = require('./orderRoute');
const startRouter = require('./startRoute');
const authRouter = require('./authRoute');
const ticketRouter = require('./ticketRoutes');
const ecRouter = require('./ecRoutes');
const adminRouter = require('./adminRoute');
const hostRouter = require('./hostRoutes');

router.use('/user', userRouter);
router.use('/auth', authRouter);
router.use('/exhibition', exhibitionRouter);
router.use('/order', orderRouter);
router.use('/ticket', ticketRouter);
router.use('/ec', ecRouter);
router.use('/start', startRouter);
router.use('/admin', adminRouter);
router.use('/host', hostRouter);

module.exports = router;
