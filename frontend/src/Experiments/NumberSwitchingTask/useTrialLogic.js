import { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { generateTrials } from './trialUtils';

const EXPERIMENT_STATES = {
  INITIALIZING: 'INITIALIZING',
  READY: 'READY',
  SHOWING_DIGIT: 'SHOWING_DIGIT',
  AWAITING_RESPONSE: 'AWAITING_RESPONSE',
  TRIAL_COMPLETE: 'TRIAL_COMPLETE',
  EXPERIMENT_COMPLETE: 'EXPERIMENT_COMPLETE'
};

export const useTrialLogic = () => {
  const config = useSelector(state => state.config);
  const [experimentState, setExperimentState] = useState(EXPERIMENT_STATES.INITIALIZING);
  const [trials, setTrials] = useState([]);
  const [currentTrialIndex, setCurrentTrialIndex] = useState(0);
  const [currentDigitIndex, setCurrentDigitIndex] = useState(0);
  const [currentDigit, setCurrentDigit] = useState(null);
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    console.log('Generating trials');
    const generatedTrials = generateTrials(config);
    setTrials(generatedTrials);
    setExperimentState(EXPERIMENT_STATES.READY);
    console.log('Trials generated, experiment ready');
  }, [config]);

  useEffect(() => {
    if (experimentState === EXPERIMENT_STATES.SHOWING_DIGIT && trials.length > 0) {
      showNextDigit();
    }
  }, [experimentState, trials, showNextDigit]);

  const startExperiment = useCallback(() => {
    console.log('Starting experiment');
    setExperimentState(EXPERIMENT_STATES.SHOWING_DIGIT);
  }, []);

  const showNextDigit = useCallback(() => {
    console.log('showNextDigit called', { currentTrialIndex, currentDigitIndex, trialsLength: trials.length });

    if (currentTrialIndex >= trials.length) {
      console.log('All trials complete');
      setExperimentState(EXPERIMENT_STATES.EXPERIMENT_COMPLETE);
      return;
    }

    const currentTrial = trials[currentTrialIndex];
    console.log('Current trial', currentTrial);

    if (!currentTrial || !currentTrial.number) {
      console.log('Invalid trial data');
      return;
    }

    const digits = currentTrial.number.split('');

    if (currentDigitIndex < digits.length) {
      const digit = digits[currentDigitIndex];
      console.log(`Setting current digit: ${digit}`);
      setCurrentDigit(digit);
      setCurrentDigitIndex(prevIndex => prevIndex + 1);
      setExperimentState(EXPERIMENT_STATES.AWAITING_RESPONSE);
    } else {
      console.log('Trial complete');
      setExperimentState(EXPERIMENT_STATES.TRIAL_COMPLETE);
      setTimeout(() => {
        setCurrentTrialIndex(prevIndex => prevIndex + 1);
        setCurrentDigitIndex(0);
        setExperimentState(EXPERIMENT_STATES.SHOWING_DIGIT);
      }, 1000); // 1 second delay before next trial
    }
  }, [currentTrialIndex, currentDigitIndex, trials, setCurrentDigit, setCurrentDigitIndex, setCurrentTrialIndex, setExperimentState]);
  
  
  const moveToNextTrial = useCallback(() => {
    console.log('Moving to next trial');
    setCurrentTrialIndex(prevIndex => prevIndex + 1);
    setCurrentDigitIndex(0);
    setResponses([]);
    setExperimentState(EXPERIMENT_STATES.SHOWING_DIGIT);
    console.log(`Experiment state changed to: ${experimentState}`);

    showNextDigit(); // Call showNextDigit when moving to the next trial
  }, [showNextDigit]);

  const handleResponse = useCallback((response) => {
    console.log(`Handling response: ${response}`);
    setResponses(prevResponses => [...prevResponses, response]);
    setCurrentDigitIndex(prevIndex => prevIndex + 1);
    setExperimentState(EXPERIMENT_STATES.SHOWING_DIGIT);
    console.log(`Experiment state changed to: ${experimentState}`);
    showNextDigit(); // Call showNextDigit after handling the response
  }, [showNextDigit]);

  return {
    experimentState,
    currentTrialIndex,
    currentDigit,
    showNextDigit,
    responses,
    startExperiment,
    handleResponse,
    trials
  };
};
