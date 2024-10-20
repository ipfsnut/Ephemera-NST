import { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setExperimentState, setCurrentDigit, addResponse } from '../../redux/eventSlice';
import { initialConfig } from './config';

export default function useTrialLogic() {
  const dispatch = useDispatch();
  const config = useSelector(state => state.config.currentConfig) || initialConfig;
  const [isLoading, setIsLoading] = useState(true);
  const [trials, setTrials] = useState([]);
  const [currentTrialIndex, setCurrentTrialIndex] = useState(0);
  const experimentId = useSelector(state => state.event.currentEvent?.id);

  const generateTrials = useCallback(() => {
    const newTrials = Array(config.TOTAL_TRIALS).fill().map(() => ({
      digit: Math.floor(Math.random() * 9) + 1,
      startTime: null,
      response: null,
      responseTime: null,
    }));
    setTrials(newTrials);
    setIsLoading(false);
  }, [config.TOTAL_TRIALS]);

  const startExperiment = useCallback(() => {
    if (trials.length === 0) {
      generateTrials();
    }
    dispatch(setExperimentState('SHOWING_DIGIT'));
    dispatch(setCurrentDigit(trials[0].digit));
    setCurrentTrialIndex(0);
  }, [dispatch, generateTrials, trials]);

  const handleResponse = useCallback((key) => {
    const currentTrial = trials[currentTrialIndex];
    const response = {
      digit: currentTrial.digit,
      response: key,
      responseTime: Date.now() - currentTrial.startTime,
    };
    dispatch(addResponse(response));

    if (currentTrialIndex < trials.length - 1) {
      setCurrentTrialIndex(prevIndex => prevIndex + 1);
      dispatch(setExperimentState('SHOWING_DIGIT'));
      dispatch(setCurrentDigit(trials[currentTrialIndex + 1].digit));
    } else {
      dispatch(setExperimentState('EXPERIMENT_COMPLETE'));
    }
  }, [currentTrialIndex, dispatch, trials]);

  useEffect(() => {
    generateTrials();
  }, [generateTrials]);

  return { startExperiment, handleResponse, isLoading, experimentId, trials };
}
