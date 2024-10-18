import { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchEvent, setExperimentState, setCurrentTrial, setCurrentDigit } from '../../redux/eventSlice';

const EXPERIMENT_STATES = {
  INITIALIZING: 'INITIALIZING',
  READY: 'READY',
  SHOWING_DIGIT: 'SHOWING_DIGIT',
  AWAITING_RESPONSE: 'AWAITING_RESPONSE',
  TRIAL_COMPLETE: 'TRIAL_COMPLETE',
  EXPERIMENT_COMPLETE: 'EXPERIMENT_COMPLETE'
};

export const useTrialLogic = () => {
  const [trials, setTrials] = useState([]);
  const [currentDigitIndex, setCurrentDigitIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const currentEvent = useSelector(state => state.event.currentEvent);
  const experimentState = useSelector(state => state.event.experimentState);
  const currentTrialIndex = useSelector(state => state.event.currentTrialIndex);
  const currentDigit = useSelector(state => state.event.currentDigit);

  useEffect(() => {
    if (!currentEvent) {
      dispatch(fetchEvent('nst'));
    }
  }, [dispatch, currentEvent]);

  useEffect(() => {
    if (currentEvent && currentEvent.trials) {
      setTrials(currentEvent.trials);
      setIsLoading(false);
      dispatch(setExperimentState(EXPERIMENT_STATES.READY));
    }
  }, [currentEvent, dispatch]);

  const startExperiment = useCallback(() => {
    dispatch(setExperimentState(EXPERIMENT_STATES.SHOWING_DIGIT));
    showNextDigit();
  }, [dispatch]);

  const showNextDigit = useCallback(() => {
    if (currentTrialIndex >= trials.length) {
      dispatch(setExperimentState(EXPERIMENT_STATES.EXPERIMENT_COMPLETE));
      return;
    }

    const currentTrial = trials[currentTrialIndex];
    if (!currentTrial || !currentTrial.number) {
      console.error('Invalid trial data');
      return;
    }

    const digits = currentTrial.number.split('');
    if (currentDigitIndex < digits.length) {
      dispatch(setCurrentDigit(digits[currentDigitIndex]));
      dispatch(setCurrentTrial(currentTrialIndex));
      dispatch(setExperimentState(EXPERIMENT_STATES.AWAITING_RESPONSE));
      setCurrentDigitIndex(prevIndex => prevIndex + 1);
    } else {
      dispatch(setExperimentState(EXPERIMENT_STATES.TRIAL_COMPLETE));
      setTimeout(() => {
        dispatch(setCurrentTrial(currentTrialIndex + 1));
        setCurrentDigitIndex(0);
        dispatch(setExperimentState(EXPERIMENT_STATES.SHOWING_DIGIT));
      }, 1000);
    }
  }, [currentTrialIndex, currentDigitIndex, trials, dispatch]);

  const handleResponse = useCallback(() => {
    dispatch(setExperimentState(EXPERIMENT_STATES.SHOWING_DIGIT));
    showNextDigit();
  }, [dispatch, showNextDigit]);

  return {
    experimentState,
    currentTrialIndex,
    currentDigit,
    showNextDigit,
    startExperiment,
    handleResponse,
    trials,
    isLoading
  };
};