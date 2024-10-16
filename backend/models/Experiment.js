const mongoose = require('mongoose');

const ExperimentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  config: {
    type: Object,
    required: true,
  },
  results: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Result'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Experiment', ExperimentSchema);
