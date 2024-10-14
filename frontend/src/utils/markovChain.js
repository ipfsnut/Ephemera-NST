const DIGITS_PER_TRIAL = 15;  // Fixed value

const generateMarkovNumber = (effortLevel, config) => {
  console.log('Generating number for effort level:', effortLevel);
  const { min, max } = config.DIFFICULTY_LEVELS[effortLevel];
  console.log('Min-Max switches:', min, max);
  const targetSwitches = Math.floor(Math.random() * (max - min + 1)) + min;
  console.log('Target switches:', targetSwitches);

  let number = '';
  let isOdd = Math.random() < 0.5;
  let switches = 0;

  for (let i = 0; i < DIGITS_PER_TRIAL; i++) {
    if (switches < targetSwitches && i < DIGITS_PER_TRIAL - 1) {
      const switchProbability = (targetSwitches - switches) / (DIGITS_PER_TRIAL - i);
      if (Math.random() < switchProbability) {
        isOdd = !isOdd;
        switches++;
        console.log('Switch occurred at position:', i);
      }
    }
    const digit = isOdd ? 
      (Math.floor(Math.random() * 5) * 2 + 1).toString() : 
      (Math.floor(Math.random() * 4) * 2 + 2).toString();
    number += digit;
  }

  console.log('Final number:', number, 'Total switches:', switches);
  return { number, effortLevel };
};

export const generateTrialNumbers = (config) => {
  const trialNumbers = [];
  const effortLevels = Object.keys(config.DIFFICULTY_LEVELS);
  
  for (let i = 0; i < config.numTrials; i++) {
    const level = effortLevels[Math.floor(i / (config.numTrials / effortLevels.length))];
    console.log('Generated Markov number:', generateMarkovNumber(level, config));
    trialNumbers.push(generateMarkovNumber(level, config));
  }
  
  // Shuffle the trial numbers
  for (let i = trialNumbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [trialNumbers[i], trialNumbers[j]] = [trialNumbers[j], trialNumbers[i]];
  }
  
  return trialNumbers;
};
