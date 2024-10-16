const express = require('express');
const experimentController = require('../../controllers/experimentController');

const router = express.Router();

router.get('/', experimentController.getAllExperiments);
router.get('/:id', experimentController.getExperimentById);
router.post('/', experimentController.createExperiment);
router.put('/:id', experimentController.updateExperiment);
router.delete('/:id', experimentController.deleteExperiment);
router.post('/generate', experimentController.generateExperiment);
router.get('/:id/export', experimentController.exportExperimentData);
module.exports = router;