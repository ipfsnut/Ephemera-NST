const Event = require('../models/Event');
const Experiment = require('../models/Experiment');
const winston = require('winston');
const { generateTrialNumbers } = require('../utils/markovChain');
const { generateCSV, createZip } = require('../utils/dataExport');
const experimentConfig = require('../config');


exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    winston.error('Error fetching events:', error);
    res.status(500).json({ message: 'Error fetching events' });
  }
};

exports.getEventById = async (req, res) => {
  try {
    console.log('Fetching event with ID:', req.params.id);
    const eventId = req.params.id;

    // Check for predefined events first
    const predefinedEvents = {
      'about': { id: 'about', name: 'About', description: 'Information about the project' },
      'experiment-list': { id: 'experiment-list', name: 'Experiment List', description: 'List of available experiments' },
      'literature': { id: 'literature', name: 'Literature', description: 'Papers and research findings' },
      'config': { id: 'config', name: 'Configure Experiment', description: 'Set up experiment parameters' },
    };

    if (predefinedEvents[eventId]) {
      console.log('Predefined event found:', predefinedEvents[eventId]);
      return res.json(predefinedEvents[eventId]);
    }

    // If not a predefined event, proceed with the existing logic
    if (eventId === 'nst') {
      const experiment = await Experiment.findOne({ name: 'Number Switching Task' });
      if (experiment) {
        return res.json({
          id: experiment._id,
          nst: 'NumberSwitchingTask',
          name: experiment.name,
          description: experiment.description,
          trials: experiment.trials
        });
      } else {
        const newExperiment = new Experiment({
          name: 'Number Switching Task',
          description: 'Cognitive effort experiment',
          configuration: experimentConfig,
          trials: generateTrialNumbers(experimentConfig)
        });
        await newExperiment.save();
        return res.json({
          id: newExperiment._id,
          nst: 'NumberSwitchingTask',
          name: newExperiment.name,
          description: newExperiment.description,
          trials: newExperiment.trials
        });
      }
    }

    // If not a predefined event, proceed with database lookup
    let event;
    if (mongoose.Types.ObjectId.isValid(eventId)) {
      event = await Event.findById(eventId);
    } else {
      event = await Event.findOne({ id: eventId });
    }

    if (!event) {
      console.log('Event not found');
      return res.status(404).json({ message: 'Event not found' });
    }
    console.log('Event found:', event);
    res.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ message: 'Error fetching event' });
  }
};exports.createEvent = async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    winston.error('Error creating event:', error);
    res.status(500).json({ message: 'Error creating event' });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(updatedEvent);
  } catch (error) {
    winston.error('Error updating event:', error);
    res.status(500).json({ message: 'Error updating event' });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    winston.error('Error deleting event:', error);
    res.status(500).json({ message: 'Error deleting event' });
  }
};

exports.generateExperiment = async (req, res) => {
  try {
    const { currentConfig } = req.body;
    const trials = generateTrialNumbers(currentConfig);
    const newExperiment = new Experiment({
      name: 'Generated Experiment',
      description: 'Automatically generated experiment',
      configuration: currentConfig,
      trials: trials
    });
    const savedExperiment = await newExperiment.save();
    res.json(savedExperiment);
  } catch (error) {
    winston.error('Error generating experiment:', error);
    res.status(500).json({ message: 'Error generating experiment' });
  }
};

exports.saveExperimentResponse = async (req, res) => {
  try {
    const { id } = req.params;
    const response = req.body;
    const experiment = await Experiment.findById(id);
    if (!experiment) {
      return res.status(404).json({ message: 'Experiment not found' });
    }
    experiment.responses.push(response);
    await experiment.save();
    res.status(200).json({ message: 'Response saved successfully' });
  } catch (error) {
    winston.error('Error saving experiment response:', error);
    res.status(500).json({ message: 'Error saving experiment response' });
  }
};

exports.exportExperimentData = async (req, res) => {
  try {
    const { id } = req.params;
    const experiment = await Experiment.findById(id);
    if (!experiment) {
      return res.status(404).json({ message: 'Experiment not found' });
    }
    const csvFile = await generateCSV(experiment.responses, 'experiment_data.csv');
    const zipFile = await createZip([csvFile], 'experiment_data.zip');
    res.download(zipFile);
  } catch (error) {
    winston.error('Error exporting experiment data:', error);
    res.status(500).json({ message: 'Error exporting experiment data' });
  }
};


exports.getExperimentResults = async (req, res) => {
  try {
    const { id } = req.params;
    const experiment = await Experiment.findById(id);
    if (!experiment) {
      return res.status(404).json({ message: 'Experiment not found' });
    }
    res.json({
      id: experiment._id,
      name: experiment.name,
      description: experiment.description,
      responses: experiment.responses,
      // Add any other relevant data you want to include in the results
    });
  } catch (error) {
    winston.error('Error fetching experiment results:', error);
    res.status(500).json({ message: 'Error fetching experiment results' });
  }
};
