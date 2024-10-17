import { useState, useCallback, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { fetchEvent, setEventFetched } from '../../redux/eventSlice';


const EXPERIMENT_STATES = {
  INITIALIZING: 'INITIALIZING',
  READY: 'READY',
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
  const fetchTrialsRef = useRef(false);
  const dispatch = useDispatch();
  const currentEvent = useSelector(state => state.event.currentEvent);
  const eventFetched = useSelector(state => state.event.eventFetched);

  useEffect(() => {
    console.log('useEffect: Checking for currentEvent and eventFetched');
    if (!currentEvent && !eventFetched) {
      dispatch(fetchEvent('nst'));
      dispatch(setEventFetched(true));
    }
  }, [dispatch, currentEvent, eventFetched]);

  const fetchTrials = useCallback(async () => {
    console.log('Fetching trials');
    if (!config || !config.DIFFICULTY_LEVELS || !config.numTrials || fetchTrialsRef.current) {
      console.log('Config not fully loaded yet or trials already fetched');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        DIFFICULTY_LEVELS: config.DIFFICULTY_LEVELS,
        numTrials: config.numTrials
      };
      console.log('Sending payload to generate trials:', payload);
      const response = await axios.post('http://localhost:5069/api/events/generate-trials', payload);
      setTrials(response.data);
      setExperimentState(EXPERIMENT_STATES.READY);
      fetchTrialsRef.current = true;
    } catch (error) {
      console.error('Error generating trials:', error);
      setExperimentState(EXPERIMENT_STATES.ERROR);
    } finally {
      setIsLoading(false);
    }
  }, [config]);

  useEffect(() => {
    console.log('useEffect: Checking experimentState and isLoading');
    if (experimentState === EXPERIMENT_STATES.INITIALIZING && !isLoading && !fetchTrialsRef.current) {
      fetchTrials();
    }
  }, [experimentState, isLoading, fetchTrials]);

  const startExperiment = useCallback(() => {
    console.log('Starting experiment');
    setExperimentState(EXPERIMENT_STATES.SHOWING_DIGIT);
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