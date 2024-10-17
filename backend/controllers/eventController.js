const Event = require('../models/Event');
const winston = require('winston');
const { generateTrialNumbers } = require('../utils/markovChain');
const { generateCSV, createZip } = require('../utils/dataExport');

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

    // Check for predefined events
    const predefinedEvents = {
      'about': { id: 'about', name: 'About', description: 'Information about the project' },
      'experiment-list': { id: 'experiment-list', name: 'Experiment List', description: 'List of available experiments' },
      'literature': { id: 'literature', name: 'Literature', description: 'Papers and research findings' },
      'nst': { id: 'nst', name: 'Number Switching Task', description: 'Cognitive flexibility experiment' },
      'config': { id: 'config', name: 'Configure Experiment', description: 'Set up experiment parameters' },
    };

    if (predefinedEvents[eventId]) {
      console.log('Predefined event found:', predefinedEvents[eventId]);
      return res.json(predefinedEvents[eventId]);
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
    const newEvent = new Event({
      name: 'Generated Experiment',
      description: 'Automatically generated experiment',
      trials: trials
    });
    const savedEvent = await newEvent.save();
    res.json(savedEvent);
  } catch (error) {
    winston.error('Error generating experiment:', error);
    res.status(500).json({ message: 'Error generating experiment' });
  }
};

exports.saveExperimentResponse = async (req, res) => {
  try {
    const { id } = req.params;
    const response = req.body;
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Experiment not found' });
    }
    event.responses.push(response);
    await event.save();
    res.status(200).json({ message: 'Response saved successfully' });
  } catch (error) {
    winston.error('Error saving experiment response:', error);
    res.status(500).json({ message: 'Error saving experiment response' });
  }
};

exports.exportExperimentData = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Experiment not found' });
    }
    const csvFile = await generateCSV(event.responses, 'experiment_data.csv');
    const zipFile = await createZip([csvFile], 'experiment_data.zip');
    res.download(zipFile);
  } catch (error) {
    winston.error('Error exporting experiment data:', error);
    res.status(500).json({ message: 'Error exporting experiment data' });
  }
};