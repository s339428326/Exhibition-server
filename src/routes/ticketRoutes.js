const express = require('express');

//controller
// const exhibitionController = require('../controller/exhibitionController');
const ticketController = require('../controller/ticketController');

const router = express.Router();

router.route('/:id').get(ticketController.getTicketData);

router.route('/user/:id').get(ticketController.getUserTickets);

router.route('/checker/:id').get(ticketController.checkerTicket);

module.exports = router;
