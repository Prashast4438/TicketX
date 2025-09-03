const express = require('express');
const router = express.Router();
const distanceController = require('../controllers/distanceController');
const ticketController = require('../controllers/ticketController');

// Distance calculation route
router.get('/distance', distanceController.calculateDistance);

// Ticket routes
router.get('/tickets/:walletAddress', ticketController.getTicketsByWallet);
router.get('/tickets/:ticketId/download', ticketController.downloadTicket);

module.exports = router;
