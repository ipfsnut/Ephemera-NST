import { useReducer, useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchEvent, setExperimentState, setCurrentTrial, setCurrentDigit } from '../../redux/eventSlice';

export const EXPERIMENT_STATES = {
  INITIALIZING: 'INITIALIZING',
  READY: 'READY',
  SHOWING_DIGIT: 'SHOWING_DIGIT',
  AWAITING_RESPONSE: 'AWAITING_RESPONSE',
  TRIAL_COMPLETE: 'TRIAL_COMPLETE',
  EXPERIMENT_COMPLETE: 'EXPERIMENT_COMPLETE'
};

// Set up the initial state for the local reducer
const initialState = {
  trials: [],
  currentDigitIndex: 0,
  isLoading: true,
  experimentState: EXPERIMENT_STATES.INITIALIZING,

};

// Define the reducer function to manage local state
function reducer(state, action) {
  switch (action.type) {
      case 'SET_TRIALS':
          return { ...state, trials: action.payload, isLoading: false };
      case 'SET_CURRENT_DIGIT_INDEX':
          return { ...state, currentDigitIndex: action.payload };
      case 'RESET_EXPERIMENT':
          return { ...initialState };
      default:
          return state;
  }
}

export const useTrialLogic = () => {
  // Set up local state management
  const [state, localDispatch] = useReducer(reducer, initialState);
    
  // Set up Redux dispatch and selectors
  const dispatch = useDispatch();
  const currentEvent = useSelector(state => state.event.currentEvent);
  const experimentState = useSelector(state => state.event.experimentState);
  const currentTrialIndex = useSelector(state => state.event.currentTrialIndex);
  const currentDigit = useSelector(state => state.event.currentDigit);
    
  // Use a ref to track if we've already fetched the event
  const fetchedRef = useRef(false);

  // Effect to fetch the event and set up trials
  useEffect(() => {
    if (!currentEvent && !fetchedRef.current) {
      fetchedRef.current = true;
      dispatch(fetchEvent('nst'));
    } else if (currentEvent && currentEvent.trials) {
      localDispatch({ type: 'SET_TRIALS', payload: currentEvent.trials });
      dispatch(setExperimentState(EXPERIMENT_STATES.READY));
    }
  }, [currentEvent, dispatch]);

  // Callback to start the experiment
  const startExperiment = useCallback(() => {
      dispatch(setExperimentState(EXPERIMENT_STATES.SHOWING_DIGIT));
      showNextDigit();
  }, [dispatch]);

  // Callback to show the next digit
  const showNextDigit = useCallback(() => {
      console.log('Showing next digit');
      if (currentTrialIndex >= state.trials.length - 1 && state.currentDigitIndex === 0) {
          dispatch(setExperimentState(EXPERIMENT_STATES.EXPERIMENT_COMPLETE));
          return;
      }

      const currentTrial = state.trials[currentTrialIndex];
      if (!currentTrial || !currentTrial.number) {
          console.error('Invalid trial data');
          return;
      }

      const digits = currentTrial.number.split('');
      if (state.currentDigitIndex < digits.length) {
          dispatch(setCurrentDigit(digits[state.currentDigitIndex]));
          dispatch(setCurrentTrial(currentTrialIndex));
          dispatch(setExperimentState(EXPERIMENT_STATES.AWAITING_RESPONSE));
          localDispatch({ type: 'SET_CURRENT_DIGIT_INDEX', payload: state.currentDigitIndex + 1 });
      } else {
          dispatch(setExperimentState(EXPERIMENT_STATES.TRIAL_COMPLETE));
          setTimeout(() => {
              dispatch(setCurrentTrial(currentTrialIndex + 1));
              localDispatch({ type: 'SET_CURRENT_DIGIT_INDEX', payload: 0 });
              dispatch(setExperimentState(EXPERIMENT_STATES.SHOWING_DIGIT));
          }, 1000);
      }
  }, [currentTrialIndex, state.currentDigitIndex, state.trials, dispatch]);

  // Callback to handle user response
  const handleResponse = useCallback(() => {
      dispatch(setExperimentState(EXPERIMENT_STATES.SHOWING_DIGIT));
      showNextDigit();
  }, [dispatch, showNextDigit]);

  // Return the necessary values and functions
  return {
      experimentState,
      currentTrialIndex,
      currentDigit,
      startExperiment,
      handleResponse,
      trials: state.trials,
      isLoading: state.isLoading,
      experimentId: currentEvent?.id,
  };
};