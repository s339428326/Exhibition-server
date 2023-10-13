const express = require('express');

//controller
// const exhibitionController = require('../controller/exhibitionController');
const orderController = require('../controller/ticketController');

const router = express.Router();

router.route('/:id').get(orderController.getTicketData);

router.route('/user/:id').get(orderController.getUserTickets);

module.exports = router;
