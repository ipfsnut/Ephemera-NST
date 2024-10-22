const express = require('express');
const router = express.Router();
const eventController = require('../../controllers/eventController');

// Home and general routes
router.get('/about', eventController.getAboutInfo);
router.get('/events', eventController.getAllEvents);

// Event-specific routes
router.get('/events/:id', eventController.getEventById);
router.post('/events', eventController.createEvent);
router.put('/events/:id', eventController.updateEvent);
router.delete('/events/:id', eventController.deleteEvent);

//Experiment-List route
router.get('/experiments', eventController.getAllExperiments);
router.get('/experiments/:experimentId/about', eventController.getExperimentAbout);

// NST-specific routes
router.post('/experiments/nst', eventController.generateNSTExperiment);
router.post('/experiments/:id/response', eventController.saveExperimentResponse);
router.put('/experiments/:id/trial-index', eventController.updateTrialIndex);
router.put('/experiments/:id/config', eventController.updateExperimentConfig);
router.put('/experiments/:id/config', eventController.updateExperimentConfig);

// Data export route
router.get('/experiments/:id/export', eventController.exportExperimentData);

// Experiment results route
router.get('/experiments/:id/results', eventController.getExperimentResults);

module.exports = router;

