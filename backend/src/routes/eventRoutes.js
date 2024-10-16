const express = require('express');
const router = express.Router();
const eventController = require('../../controllers/eventController')
// Goal 3: API Development - Event Routes
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);
router.post('/', eventController.createEvent);
router.put('/:id', eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);


module.exports = router;