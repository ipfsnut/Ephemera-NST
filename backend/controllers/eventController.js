const eventService = require('../services/eventService');

exports.getEvent = (req, res) => {
  const eventId = req.params.id;
  const event = eventService.getEvent(eventId);
  if (event.error) {
    return res.status(404).json(event);
  }
  res.json(event);
};
