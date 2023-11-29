const express = require('express');

const router = express.Router();

const userRouter = require('./userRoutes');
const exhibitionRouter = require('./exhibitionRoutes');
const orderRouter = require('./orderRoutes');
const startRouter = require('./startRoutes');
const authRouter = require('./authRoutes');
const ticketRouter = require('./ticketRoutes');
const ecRouter = require('./ecRoutes');
// const adminRouter = require('./adminRoutes');
const hostRouter = require('./hostRoutes');
const workerRouter = require('./workerRoutes');
const partnerRouter = require('./partnerRoutes');
const departmentRouter = require('./departmentRoutes');

router.use('/user', userRouter);
router.use('/auth', authRouter);
router.use('/exhibition', exhibitionRouter);
router.use('/order', orderRouter);
router.use('/ticket', ticketRouter);
router.use('/ec', ecRouter);
router.use('/start', startRouter);
// router.use('/admin', adminRouter);
router.use('/host', hostRouter);
router.use('/worker', workerRouter);
router.use('/partner', partnerRouter);
router.use('/department', departmentRouter);

module.exports = router;
