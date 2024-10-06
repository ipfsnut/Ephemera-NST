import { CONFIG } from '../config/numberSwitchingConfig';

const generateMarkovNumber = (effortLevel) => {
  const { min, max } = CONFIG.DIFFICULTY_LEVELS[effortLevel];
  const targetSwitches = Math.floor(Math.random() * (max - min + 1)) + min;

  let number = '';
  let isOdd = Math.random() < 0.5;
  let switches = 0;

  for (let i = 0; i < CONFIG.DIGITS_PER_TRIAL; i++) {
    if (switches < targetSwitches && i < CONFIG.DIGITS_PER_TRIAL - 1) {
      const switchProbability = (targetSwitches - switches) / (CONFIG.DIGITS_PER_TRIAL - i);
      if (Math.random() < switchProbability) {
        isOdd = !isOdd;
        switches++;
      }
    }
    number += isOdd ? (Math.floor(Math.random() * 5) * 2 + 1).toString() : (Math.floor(Math.random() * 5) * 2).toString();
  }

  return { number, effortLevel };
};

export const generateTrialNumbers = () => {
  const trialNumbers = [];
  const effortLevels = Object.keys(CONFIG.DIFFICULTY_LEVELS);
  
  for (let i = 0; i < CONFIG.TOTAL_TRIALS; i++) {
    const level = effortLevels[Math.floor(i / (CONFIG.TOTAL_TRIALS / effortLevels.length))];
    trialNumbers.push(generateMarkovNumber(level));
  }
  
  // Shuffle the trial numbers
  for (let i = trialNumbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [trialNumbers[i], trialNumbers[j]] = [trialNumbers[j], trialNumbers[i]];
  }
  
  return trialNumbers;
};