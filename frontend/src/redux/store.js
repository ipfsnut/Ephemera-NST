import { configureStore } from '@reduxjs/toolkit';
import configReducer from './configSlice';
import eventReducer from './eventSlice';
import globalStateReducer from './globalState';
import loggingMiddleware from '../Experiments/loggingMiddleware';

const store = configureStore({
  reducer: {
    config: configReducer,
    event: eventReducer,
    globalState: globalStateReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(loggingMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;