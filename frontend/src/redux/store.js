import { configureStore } from '@reduxjs/toolkit';
import experimentReducer from './experimentSlice';
import configReducer from './configSlice';
import eventReducer from './eventSlice';

export const store = configureStore({
  reducer: {
    experiment: experimentReducer,
    config: configReducer,
    event: eventReducer,
  },
});
