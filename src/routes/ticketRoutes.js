const express = require('express');

//controller
// const exhibitionController = require('../controller/exhibitionController');
const orderController = require('../controller/ticketController');

const router = express.Router();

router.route('/:id').get(orderController.getTicketData);

module.exports = router;
