const express = require('express');
const router = express.Router();
const experimentController = require('../../controllers/experimentController');
const experimentConfig = require('../../config');

// Goal 3: API Development - Experiment Routes
router.get('/', experimentController.getAllExperiments);
router.get('/:id', experimentController.getExperimentById);
router.post('/', experimentController.createExperiment);
router.put('/:id', experimentController.updateExperiment);
router.delete('/:id', experimentController.deleteExperiment);
router.get('/:id/export', experimentController.exportExperimentData);
router.post('/generate', experimentController.generateExperiment);
router.post('/export', experimentController.exportExperimentData);

router.get('/config', (req, res) => {
    res.json(experimentConfig);
  });
  
  router.put('/config', experimentController.updateConfig);

module.exports = router;

