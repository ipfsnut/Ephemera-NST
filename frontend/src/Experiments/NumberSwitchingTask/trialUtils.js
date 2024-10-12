// frontend/src/Experiments/NumberSwitchingTask/trialUtils.js

import { generateTrialNumbers } from '../../utils/markovChain';

export const generateTrials = (config) => {
  console.log('Generating trials with config:', config);
  const trials = generateTrialNumbers(config.numTrials, config.difficultyLevels, config.trialsPerDifficulty);
  console.log('Generated trials:', trials);
  return trials;
};

export const isValidTrial = (trial) => {
  console.log('Validating trial:', trial);
  const isValid = trial && trial.effortLevel && trial.number && trial.number.length === 15;
  console.log('Trial is valid:', isValid);
  return isValid;
};

export const processTrialResponse = (currentDigit, response, keys) => {
  console.log('Processing response:', { currentDigit, response, keys });
  const isOdd = parseInt(currentDigit) % 2 !== 0;
  const isCorrect = (response === keys.ODD && isOdd) || (response === keys.EVEN && !isOdd);
  
  return {
    digit: currentDigit,
    response: response,
    correct: isCorrect,
    responseTime: performance.now()
  };
};
