const { generateTrialNumbers } = require('../../utils/markovChain');
const experimentConfig = require('../../config');

const generateNSTTrials = () => {
  return generateTrialNumbers(experimentConfig);
};

const handleNSTResponse = (response, currentTrial) => {
  const isCorrect = (currentTrial.digit % 2 === 0 && response === 'j') ||
                    (currentTrial.digit % 2 !== 0 && response === 'f');
  
  return {
    digit: currentTrial.digit,
    response: response,
    responseTime: Date.now() - currentTrial.startTime,
    isCorrect: isCorrect
  };
};

const isNSTComplete = (currentTrialIndex, totalTrials) => {
  return currentTrialIndex >= totalTrials - 1;
};

const getNextNSTState = (currentState, action) => {
  switch (currentState) {
    case 'INITIALIZING':
      return 'SHOWING_DIGIT';
    case 'SHOWING_DIGIT':
      return action === 'RESPONSE_RECEIVED' ? 'INTER_TRIAL_DELAY' : currentState;
    case 'INTER_TRIAL_DELAY':
      return 'SHOWING_DIGIT';
    default:
      return currentState;
  }
};

module.exports = {
  generateNSTTrials,
  handleNSTResponse,
  isNSTComplete,
  getNextNSTState
};