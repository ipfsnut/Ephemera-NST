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

  const showNextDigit = useCallback(() => {
    if (currentTrialIndex < trials.length) {
      dispatch(setExperimentState('SHOWING_DIGIT'));
      dispatch(setCurrentDigit(trials[currentTrialIndex].digit));
      trials[currentTrialIndex].startTime = Date.now();
    } else {
      dispatch(setExperimentState('EXPERIMENT_COMPLETE'));
    }
  }, [currentTrialIndex, dispatch, trials]);

  const startExperiment = useCallback(() => {
    if (trials.length > 0) {
      showNextDigit();
    }
  }, [showNextDigit, trials]);

  const handleResponse = useCallback((key) => {
    if (currentTrialIndex < trials.length) {
      const currentTrial = trials[currentTrialIndex];
      const isCorrect = (currentTrial.digit % 2 === 0 && key === 'j') || 
                        (currentTrial.digit % 2 !== 0 && key === 'f');
      const response = {
        digit: currentTrial.digit,
        response: key,
        responseTime: Date.now() - currentTrial.startTime,
        isCorrect: isCorrect
      };
      dispatch(addResponse(response));

      setCurrentTrialIndex(prevIndex => prevIndex + 1);
      showNextDigit();
    }
  }, [currentTrialIndex, dispatch, trials, showNextDigit]);

  useEffect(() => {
    initializeTrials();
  }, [initializeTrials]);

  return { startExperiment, handleResponse, isLoading, trials };
}