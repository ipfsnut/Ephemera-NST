import { createSlice } from '@reduxjs/toolkit';
import { CONFIG } from '../config/numberSwitchingConfig';

const initialState = {
  numTrials: 14,
  difficultyLevels: Object.keys(CONFIG.DIFFICULTY_LEVELS),
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
    resetConfig: (state) => {
      return initialState;
    },
  },
});

export const { updateConfig, resetConfig } = configSlice.actions;
export default configSlice.reducer;