import { useState, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setExperimentState, setCurrentDigit, addResponse } from '../../redux/eventSlice';

export default function useTrialLogic(experiment) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [trials, setTrials] = useState([]);
  const [currentTrialIndex, setCurrentTrialIndex] = useState(0);

  const initializeTrials = useCallback(() => {
    if (experiment && experiment.trials && experiment.trials.length > 0) {
      const formattedTrials = experiment.trials.map(trial => ({
        digit: parseInt(trial.number),
        startTime: null,
        response: null,
        responseTime: null,
      }));
      setTrials(formattedTrials);
      setIsLoading(false);
    }
  }, [experiment]);

  const startExperiment = useCallback(() => {
    if (trials.length > 0) {
      dispatch(setExperimentState('SHOWING_DIGIT'));
      dispatch(setCurrentDigit(trials[0].digit));
      setCurrentTrialIndex(0);
    }
  }, [dispatch, trials]);

  const handleResponse = useCallback((key) => {
    if (currentTrialIndex < trials.length) {
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
    }
  }, [currentTrialIndex, dispatch, trials]);

  useEffect(() => {
    initializeTrials();
  }, [initializeTrials]);

  return { startExperiment, handleResponse, isLoading, trials };
}