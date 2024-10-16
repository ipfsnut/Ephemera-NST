const Experiment = require('../models/Experiment');
const winston = require('winston');
const { generateTrialNumbers } = require('../utils/markovChain');
const { createAndDownloadZip } = require('../utils/zipCreator');


// Goal 3: API Development - Experiments
exports.getAllExperiments = async (req, res) => {
  try {
    const experiments = await Experiment.find();
    res.json(experiments);
  } catch (error) {
    winston.error('Error fetching experiments:', error);
    res.status(500).json({ message: 'Error fetching experiments' });
  }
};

exports.getExperimentById = async (req, res) => {
  try {
    const id = req.params.id;
    let experiment;
    
    if (mongoose.Types.ObjectId.isValid(id)) {
      experiment = await Experiment.findById(id);
    } else {
      experiment = await Experiment.findOne({ _id: id });
    }

    if (!experiment) {
      return res.status(404).json({ message: 'Experiment not found' });
    }
    res.json(experiment);
  } catch (error) {
    console.error('Error fetching experiment:', error);
    res.status(500).json({ message: 'Error fetching experiment' });
  }
};
exports.createExperiment = async (req, res) => {
  try {
    const newExperiment = new Experiment(req.body);
    const savedExperiment = await newExperiment.save();
    res.status(201).json(savedExperiment);
  } catch (error) {
    winston.error('Error creating experiment:', error);
    res.status(500).json({ message: 'Error creating experiment' });
  }
};

exports.updateExperiment = async (req, res) => {
  try {
    const updatedExperiment = await Experiment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedExperiment) {
      return res.status(404).json({ message: 'Experiment not found' });
    }
    res.json(updatedExperiment);
  } catch (error) {
    winston.error('Error updating experiment:', error);
    res.status(500).json({ message: 'Error updating experiment' });
  }
};

exports.deleteExperiment = async (req, res) => {
  try {
    const deletedExperiment = await Experiment.findByIdAndDelete(req.params.id);
    if (!deletedExperiment) {
      return res.status(404).json({ message: 'Experiment not found' });
    }
    res.json({ message: 'Experiment deleted successfully' });
  } catch (error) {
    winston.error('Error deleting experiment:', error);
    res.status(500).json({ message: 'Error deleting experiment' });
  }
};

exports.generateExperiment = (req, res) => {
  try {
    const config = req.body;
    const trialNumbers = generateTrialNumbers(config);
    res.json({ trialNumbers });
  } catch (error) {
    winston.error('Error generating experiment:', error);
    res.status(500).json({ message: 'Error generating experiment' });
  }
};

exports.exportExperimentData = async (req, res) => {
  try {
    const experiment = await Experiment.findById(req.params.id).populate('results');
    if (!experiment) {
      return res.status(404).json({ message: 'Experiment not found' });
    }

    const zipFilename = await createAndDownloadZip(experiment.results);
    res.download(zipFilename, (err) => {
      if (err) {
        winston.error('Error sending file:', err);
        res.status(500).json({ message: 'Error sending file' });
      }
      // Clean up files after sending
      fs.unlinkSync(zipFilename);
    });
  } catch (error) {
    winston.error('Error exporting experiment data:', error);
    res.status(500).json({ message: 'Error exporting experiment data' });
  }
};

// backend/controllers/experimentController.js
// ... existing imports and methods ...

exports.updateConfig = (req, res) => {
  try {
    const newConfig = req.body;
    // Here you would typically update the config in a database
    // For now, we'll just send back the received config
    res.json(newConfig);
  } catch (error) {
    winston.error('Error updating config:', error);
    res.status(500).json({ message: 'Error updating config' });
  }
};
