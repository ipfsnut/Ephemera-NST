const express = require('express');
const router = express.Router();
const eventController = require('../../controllers/eventController');
const { generateTrialNumbers } = require('../../utils/markovChain');

router.get('/', eventController.getAllEvents);
router.post('/', eventController.createEvent);
router.post('/generate', eventController.generateExperiment);
router.post('/generate-trials', (req, res) => {
  console.log('Received request to generate trials');
  const { currentConfig } = req.body;
  console.log('Config received:', currentConfig);

  if (!currentConfig || !currentConfig.DIFFICULTY_LEVELS || !currentConfig.numTrials) {
    console.error('Invalid config object received');
    return res.status(400).json({ error: 'Invalid configuration' });
  }

  try {
    const trials = generateTrialNumbers(currentConfig);
    console.log('Trials generated successfully');
    res.json(trials);
  } catch (error) {
    console.error('Error generating trials:', error);
    res.status(500).json({ error: 'Failed to generate trials' });
  }
});

router.get('/:id/export', eventController.exportExperimentData);
router.post('/:id/responses', eventController.saveExperimentResponse);
router.get('/:id/results', eventController.getExperimentResults);

router.get('/:id', eventController.getEventById);
router.put('/:id', eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);

module.exports = router;
