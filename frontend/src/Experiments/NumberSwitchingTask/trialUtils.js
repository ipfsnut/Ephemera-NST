// frontend/src/Experiments/NumberSwitchingTask/trialUtils.js

import { generateTrialNumbers } from '../../utils/markovChain';

export const generateTrials = (config) => {
  console.log('Generating trials with config:', config);
  const { numTrials, difficultyLevels } = config;
  const trialNumbers = generateTrialNumbers(numTrials, difficultyLevels);

  const trials = trialNumbers.map((number, index) => ({
    id: index + 1,
    number: number.toString().padStart(15, '0'),
    effortLevel: calculateEffortLevel(number),
    digits: number.toString().padStart(15, '0').split(''),
  }));

  console.log('Generated trials:', trials);
  return trials;
};

export const getNextDigit = (trial) => {
  if (trial.currentDigitIndex < trial.digits.length) {
    const digit = trial.digits[trial.currentDigitIndex];
    trial.currentDigitIndex++;
    return digit;
  }
  return null;
};

export const isValidTrial = (trial) => {
  console.log('Validating trial:', trial);

  const isValid = trial && 
                  trial.effortLevel && 
                  trial.number && 
                  trial.number.length === 15;

  console.log('Trial is valid:', isValid);

  return isValid;
};

export const processTrialResponse = (currentDigit, response, keys) => {
  const isOdd = parseInt(currentDigit) % 2 !== 0;
  const isCorrect = (response === keys.ODD && isOdd) || (response === keys.EVEN && !isOdd);
  
  return {
    digit: currentDigit,
    response: response,
    correct: isCorrect,
    responseTime: performance.now()
  };
};

const calculateEffortLevel = (number) => {
  const digits = number.toString().padStart(15, '0').split('').map(Number);
  let switches = 0;
  for (let i = 1; i < digits.length; i++) {
    if ((digits[i] % 2) !== (digits[i-1] % 2)) switches++;
  }
  return Math.min(Math.ceil(switches / 2), 7);
};
