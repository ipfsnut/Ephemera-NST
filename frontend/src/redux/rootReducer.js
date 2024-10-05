import { combineReducers } from 'redux';
import eventReducer from './eventSlice';

const rootReducer = combineReducers({
  event: eventReducer,
});

export default rootReducer;
