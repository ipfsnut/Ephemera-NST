import { configureStore } from '@reduxjs/toolkit';
import configReducer from './configSlice';
import eventReducer from './eventSlice';
import loggingMiddleware from '../Experiments/loggingMiddleware';

const store = configureStore({
  reducer: {
    config: configReducer,
    event: eventReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(loggingMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

const initialState = {
  TOTAL_TRIALS: 1,
  DIGITS_PER_TRIAL: 15,
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
  INTER_TRIAL_DELAY: 0
};

export default store;
