const Experiment = require('../models/Experiment');
const winston = require('winston');
const { generateTrialNumbers } = require('../utils/markovChain');
const { createAndDownloadZip } = require('../utils/zipCreator');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const mongoose = require('mongoose');



exports.getAllExperiments = asyncHandler(async (req, res) => {
  const experiments = await Experiment.find();
  res.json(experiments);
});

exports.getExperimentById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  let experiment;
  
  if (mongoose.Types.ObjectId.isValid(id)) {
    experiment = await Experiment.findById(id);
  } else {
    experiment = await Experiment.findOne({ _id: id });
  }

  if (!experiment) {
    throw new AppError('Experiment not found', 404);
  }
  res.json(experiment);
});
exports.createExperiment = asyncHandler(async (req, res) => {
  const newExperiment = await Experiment.create(req.body);
  res.status(201).json(newExperiment);
});

exports.updateExperiment = asyncHandler(async (req, res) => {
  const updatedExperiment = await Experiment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!updatedExperiment) {
    throw new AppError('Experiment not found', 404);
  }
  res.json(updatedExperiment);
});

exports.deleteExperiment = asyncHandler(async (req, res) => {
  const deletedExperiment = await Experiment.findByIdAndDelete(req.params.id);
  if (!deletedExperiment) {
    throw new AppError('Experiment not found', 404);
  }
  res.json({ message: 'Experiment deleted successfully' });
});

exports.generateExperiment = asyncHandler(async (req, res) => {
  const config = req.body;
  const trialNumbers = generateTrialNumbers(config);
  res.json({ trialNumbers });
});

exports.exportExperimentData = asyncHandler(async (req, res) => {
  const experiment = await Experiment.findById(req.params.id).populate('results');
  if (!experiment) {
    throw new AppError('Experiment not found', 404);
  }

  const zipFilename = await createAndDownloadZip(experiment.results);
  res.download(zipFilename, (err) => {
    if (err) {
      throw new AppError('Error sending file', 500);
    }
    fs.unlinkSync(zipFilename);
  });
});

exports.updateConfig = asyncHandler(async (req, res) => {
  const newConfig = req.body;
  // Here you would typically update the config in the database
  // For this example, we'll just send back the received config
  res.json(newConfig);
});
