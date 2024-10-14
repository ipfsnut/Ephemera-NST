import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  DIFFICULTY_LEVELS: {
    1: { min: 1, max: 2 },
    2: { min: 3, max: 4 },
    3: { min: 5, max: 6 },
    4: { min: 7, max: 8 },
    5: { min: 9, max: 10 },
    6: { min: 11, max: 12 },
    7: { min: 13, max: 14 },
  },
  KEYS: {
    ODD: 'f',
    EVEN: 'j'
  },
  INTER_TRIAL_DELAY: 2000,
  numTrials: 14,
  difficultyLevels: ['1', '2', '3', '4', '5', '6', '7'],
  trialsPerDifficulty: 2,
  isCustom: false
};

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    updateConfig: (state, action) => {
      return { ...state, ...action.payload };
    },
    resetConfig: () => {
      return initialState;
    },
  },
});

export const { updateConfig, resetConfig } = configSlice.actions;
export default configSlice.reducer;