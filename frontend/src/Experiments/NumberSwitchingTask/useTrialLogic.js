import { useState, useCallback, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { fetchEvent, setEventFetched } from '../../redux/eventSlice';
import { v4 as uuidv4 } from 'uuid';

const EXPERIMENT_STATES = {
  INITIALIZING: 'INITIALIZING',
  READY: 'READY',
  RUNNING: 'RUNNING',
  SHOWING_DIGIT: 'SHOWING_DIGIT',
  AWAITING_RESPONSE: 'AWAITING_RESPONSE',
  TRIAL_COMPLETE: 'TRIAL_COMPLETE',
  EXPERIMENT_COMPLETE: 'EXPERIMENT_COMPLETE'
};

export const useTrialLogic = () => {
  const config = useSelector(state => state.config.currentConfig);
  const [experimentState, setExperimentState] = useState(EXPERIMENT_STATES.INITIALIZING);
  const [trials, setTrials] = useState([]);
  const [currentTrialIndex, setCurrentTrialIndex] = useState(0);
  const [currentDigitIndex, setCurrentDigitIndex] = useState(0);
  const [currentDigit, setCurrentDigit] = useState(null);
  const [responses, setResponses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const currentEvent = useSelector(state => state.event.currentEvent);
  const eventFetched = useSelector(state => state.event.eventFetched);

  useEffect(() => {
    if (!currentEvent && !eventFetched) {
      dispatch(fetchEvent('nst'));
      dispatch(setEventFetched(true));
    }
  }, [dispatch, currentEvent, eventFetched]);

  useEffect(() => {
    if (currentEvent && currentEvent.trials) {
      setTrials(currentEvent.trials);
      setIsLoading(false);
      setExperimentState(EXPERIMENT_STATES.READY);
    }
  }, [currentEvent]);

  const startExperiment = useCallback(() => {
    setExperimentState(EXPERIMENT_STATES.RUNNING);
    showNextDigit();
  }, []);

  const showNextDigit = useCallback(() => {
    if (currentTrialIndex >= trials.length) {
      setExperimentState(EXPERIMENT_STATES.EXPERIMENT_COMPLETE);
      return;
    }

    const currentTrial = trials[currentTrialIndex];
    if (!currentTrial || !currentTrial.number) {
      console.error('Invalid trial data');
      return;
    }

    const digits = currentTrial.number.split('');
    if (currentDigitIndex < digits.length) {
      setCurrentDigit(digits[currentDigitIndex]);
      setCurrentDigitIndex(prevIndex => prevIndex + 1);
      setExperimentState(EXPERIMENT_STATES.AWAITING_RESPONSE);
    } else {
      setExperimentState(EXPERIMENT_STATES.TRIAL_COMPLETE);
      setTimeout(() => {
        setCurrentTrialIndex(prevIndex => prevIndex + 1);
        setCurrentDigitIndex(0);
        setExperimentState(EXPERIMENT_STATES.SHOWING_DIGIT);
      }, 1000);
    }
  }, [currentTrialIndex, currentDigitIndex, trials]);

  const handleResponse = useCallback((response) => {
    setResponses(prevResponses => [...prevResponses, response]);
    setExperimentState(EXPERIMENT_STATES.SHOWING_DIGIT);
    showNextDigit();
  }, [showNextDigit]);

  return {
    experimentState,
    setExperimentState,
    currentTrialIndex,
    currentDigit,
    showNextDigit,
    responses,
    startExperiment,
    handleResponse,
    trials,
    isLoading
  };
};