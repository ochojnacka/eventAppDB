const express = require('express');
const router = express.Router();

const TicketController = require('../controllers/tickets');

const checkAuth = require("../../middleware/checkAuth")

router.get('/', TicketController.getAllTickets);
router.get("/:ticketId", TicketController.getTicketById);

router.post('/', checkAuth, TicketController.createTicket);
router.post('/assign', checkAuth, TicketController.assignTicketToUsers);
router.put("/:ticketId", checkAuth, TicketController.updateTicket);
router.delete("/:ticketId", checkAuth, TicketController.deleteTicket);

module.exports = router;