const DIGITS_PER_TRIAL = 15;

const generateMarkovNumber = (effortLevel, config) => {
  const { min, max } = config.DIFFICULTY_LEVELS[effortLevel];
  const targetSwitches = Math.floor(Math.random() * (max - min + 1)) + min;

  let number = '';
  let isOdd = Math.random() < 0.5;
  let switches = 0;

  for (let i = 0; i < DIGITS_PER_TRIAL; i++) {
    if (switches < targetSwitches && i < DIGITS_PER_TRIAL - 1) {
      const switchProbability = (targetSwitches - switches) / (DIGITS_PER_TRIAL - i);
      if (Math.random() < switchProbability) {
        isOdd = !isOdd;
        switches++;
      }
    }
    const digit = isOdd ? 
      (Math.floor(Math.random() * 5) * 2 + 1).toString() : 
      (Math.floor(Math.random() * 4) * 2 + 2).toString();
    number += digit;
  }

  return { number, effortLevel };
};

const generateTrialNumbers = (config) => {
  const trialNumbers = [];
  const effortLevels = Object.keys(config.DIFFICULTY_LEVELS);
  
  for (let i = 0; i < config.numTrials; i++) {
    const level = effortLevels[Math.floor(i / (config.numTrials / effortLevels.length))];
    trialNumbers.push(generateMarkovNumber(level, config));
  }
  
  // Shuffle the trial numbers
  for (let i = trialNumbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [trialNumbers[i], trialNumbers[j]] = [trialNumbers[j], trialNumbers[i]];
  }
  
  return trialNumbers;
};

module.exports = { generateTrialNumbers };