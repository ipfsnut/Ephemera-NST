const express = require('express');
const router = express.Router();
const eventController = require('../../controllers/eventController');
const { generateTrialNumbers } = require('../../utils/markovChain');

router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);
router.post('/', eventController.createEvent);
router.put('/:id', eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);

// Add experiment-specific endpoints
router.post('/generate', eventController.generateExperiment);
router.get('/:id/export', eventController.exportExperimentData);
router.post('/:id/responses', eventController.saveExperimentResponse);

const events = {
    'about': { id: 'about', name: 'About', description: 'Information about the project' },
    'experiment-list': { id: 'experiment-list', name: 'Experiment List', description: 'List of available experiments' },
    'literature': { id: 'literature', name: 'Literature', description: 'Papers and research findings' },
    'nst': { id: 'nst', name: 'Number Switching Task', description: 'Cognitive flexibility experiment' },
    'about-nst': { id: 'about-nst', name: 'About NST', description: 'Information about the Number Switching Task' },
    'config': { id: 'config', name: 'Configure Experiment', description: 'Set up experiment parameters' },
  };
  
  router.get('/:id', (req, res) => {
    const event = events[req.params.id];
    if (event) {
      res.json(event);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  });

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
  });module.exports = router;

