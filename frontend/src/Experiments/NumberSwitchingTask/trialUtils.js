import { generateTrialNumbers } from '../../utils/markovChain';

export const generateTrials = (config) => {
  console.log('Generating trials with config:', config);
  return generateTrialNumbers(config);
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

export const isValidTrial = (trial) => {
  return trial && 
         trial.effortLevel && 
         trial.number && 
         trial.number.length === 15;
};
