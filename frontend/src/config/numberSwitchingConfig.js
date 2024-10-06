export const numberSwitchingConfig = {
  totalTrials: 50,
  stimulusDuration: 1500, // in milliseconds
  interTrialInterval: 500, // in milliseconds
  practiceTrials: 5,
  markovTransitionProbabilities: {
    even: { even: 0.3, odd: 0.7 },
    odd: { even: 0.7, odd: 0.3 }
  },
  keyMappings: {
    odd: 'f',
    even: 'j'
  },
  numberRange: { min: 1, max: 9 }
};
