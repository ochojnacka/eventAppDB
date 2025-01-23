const express = require('express');
const router = express.Router();

const EventController = require('../controllers/events');

const checkAuth = require("../../middleware/checkAuth");

router.get('/count-by-category', (req, res, next) => {
    console.log("Wywołano trasę /count-by-category");
    next();
}, EventController.countEventsByCategory);

router.get('/', EventController.getAllEvents);
router.get("/:eventId", EventController.getEventById);

router.post('/', checkAuth, EventController.createEvent);
router.put("/:eventId", checkAuth, EventController.updateEvent);
router.delete("/:eventId", checkAuth, EventController.deleteEvent);

module.exports = router;