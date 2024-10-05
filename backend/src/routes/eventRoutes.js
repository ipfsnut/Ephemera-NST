const express = require('express');
const router = express.Router();

const events = {
  '1': { id: '1', name: 'Event 1', description: 'Description for Event 1' },
  '2': { id: '2', name: 'Event 2', description: 'Description for Event 2' },
  '3': { id: '3', name: 'Event 3', description: 'Description for Event 3' },
};

router.get('/:id', (req, res) => {
  const event = events[req.params.id];
  if (event) {
    res.json(event);
  } else {
    res.status(404).json({ message: 'Event not found' });
  }
});
module.exports = router;