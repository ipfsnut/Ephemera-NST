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
  console.log('Generating trial numbers with config:', JSON.stringify(config, null, 2));

  const trialNumbers = [];
  const difficultyLevels = config.difficultyLevels;
  console.log(`Using difficulty levels: ${difficultyLevels.join(', ')}`);

  for (let i = 0; i < config.numTrials; i++) {
    const level = difficultyLevels[i % difficultyLevels.length];
    console.log(`Generating trial ${i + 1} with difficulty level ${level}`);
    trialNumbers.push(generateMarkovNumber(level, config));
  }

  console.log(`Generated ${trialNumbers.length} trials before shuffling`);

  // Shuffle the trial numbers
  for (let i = trialNumbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [trialNumbers[i], trialNumbers[j]] = [trialNumbers[j], trialNumbers[i]];
  }

  console.log(`Final trial count after shuffling: ${trialNumbers.length}`);
  return trialNumbers;
};


module.exports = { generateTrialNumbers };