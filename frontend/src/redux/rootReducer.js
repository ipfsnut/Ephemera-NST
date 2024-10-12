import { combineReducers } from 'redux';
import eventReducer from './eventSlice';
import configReducer from './configSlice';

const rootReducer = combineReducers({
  event: eventReducer,
  config: configReducer,
});

export default rootReducer;