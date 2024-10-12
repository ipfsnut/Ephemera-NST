import { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { generateTrials, processTrialResponse } from './trialUtils';
import { CONFIG } from '../../config/numberSwitchingConfig';

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
    const generatedTrials = generateTrials(config);
    setTrials(generatedTrials);
    setExperimentState(EXPERIMENT_STATES.READY);
  }, [config]);

  const startExperiment = useCallback(() => {
    if (experimentState === EXPERIMENT_STATES.READY) {
      setExperimentState(EXPERIMENT_STATES.SHOWING_DIGIT);
    }
  }, [experimentState]);

  const showNextDigit = useCallback(() => {
    if (currentDigitIndex < 15) {
      setCurrentDigit(trials[currentTrialIndex].number[currentDigitIndex]);
      setCurrentDigitIndex(prevIndex => prevIndex + 1);
      setExperimentState(EXPERIMENT_STATES.AWAITING_RESPONSE);
    } else {
      setExperimentState(EXPERIMENT_STATES.TRIAL_COMPLETE);
    }
  }, [currentTrialIndex, currentDigitIndex, trials]);

  const handleResponse = useCallback((response) => {
    if (experimentState === EXPERIMENT_STATES.AWAITING_RESPONSE) {
      const newResponse = processTrialResponse(currentDigit, response, CONFIG.KEYS);
      setResponses(prevResponses => [...prevResponses, newResponse]);
      setExperimentState(EXPERIMENT_STATES.SHOWING_DIGIT);
    }
  }, [experimentState, currentDigit]);

  const moveToNextTrial = useCallback(() => {
    if (currentTrialIndex + 1 < trials.length) {
      setCurrentTrialIndex(prevIndex => prevIndex + 1);
      setCurrentDigitIndex(0);
      setResponses([]);
      setExperimentState(EXPERIMENT_STATES.SHOWING_DIGIT);
    } else {
      setExperimentState(EXPERIMENT_STATES.EXPERIMENT_COMPLETE);
    }
  }, [currentTrialIndex, trials]);

  useEffect(() => {
    switch (experimentState) {
      case EXPERIMENT_STATES.SHOWING_DIGIT:
        showNextDigit();
        break;
      case EXPERIMENT_STATES.TRIAL_COMPLETE:
        moveToNextTrial();
        break;
      default:
        break;
    }
  }, [experimentState, showNextDigit, moveToNextTrial]);

  return {
    experimentState,
    currentTrialIndex,
    currentDigit,
    responses,
    startExperiment,
    handleResponse,
    trials
  };
};
