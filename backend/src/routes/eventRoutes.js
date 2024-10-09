const express = require('express');
const router = express.Router();

const events = {
  '1': { id: '1', name: 'About', description: 'Information about the project' },
  '2': { id: '2', name: 'Experiment List', description: 'List of available experiments' },
  '3': { id: '3', name: 'Literature', description: 'Papers and research findings' },
  'nst': { id: 'nst', name: 'Number Switching Task', description: 'Cognitive flexibility experiment' },
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