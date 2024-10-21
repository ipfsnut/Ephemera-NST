import { useState, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setExperimentState, setCurrentDigit, addResponse } from '../../redux/eventSlice';

export default function useTrialLogic(experiment) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [trials, setTrials] = useState([]);
  const [currentTrialIndex, setCurrentTrialIndex] = useState(0);
  const [currentDigitIndex, setCurrentDigitIndex] = useState(0);

  const initializeTrials = useCallback(() => {
    if (experiment && experiment.trials && experiment.trials.length > 0) {
      const formattedTrials = experiment.trials.map(trial => ({
        digits: trial.number.toString().split('').map(Number),
        responses: [],
        startTime: null,
      }));
      setTrials(formattedTrials);
      setIsLoading(false);
    }
  }, [experiment]);

  const showNextDigit = useCallback(() => {
    if (currentTrialIndex < trials.length) {
      const currentTrial = trials[currentTrialIndex];
      if (currentDigitIndex < currentTrial.digits.length) {
        dispatch(setExperimentState('SHOWING_DIGIT'));
        dispatch(setCurrentDigit(currentTrial.digits[currentDigitIndex]));
        if (currentDigitIndex === 0) {
          currentTrial.startTime = Date.now();
        }
      } else {
        setCurrentTrialIndex(prevIndex => prevIndex + 1);
        setCurrentDigitIndex(0);
        showNextDigit();
      }
    } else {
      dispatch(setExperimentState('EXPERIMENT_COMPLETE'));
    }
  }, [currentTrialIndex, currentDigitIndex, dispatch, trials]);

  const startExperiment = useCallback(() => {
    if (trials.length > 0) {
      showNextDigit();
    }
  }, [showNextDigit, trials]);

  const handleResponse = useCallback((key) => {
    if (currentTrialIndex < trials.length) {
      const currentTrial = trials[currentTrialIndex];
      const currentDigit = currentTrial.digits[currentDigitIndex];
      const isCorrect = (currentDigit % 2 === 0 && key === 'j') ||
                        (currentDigit % 2 !== 0 && key === 'f');
      const response = {
        digit: currentDigit,
        response: key,
        responseTime: Date.now() - currentTrial.startTime,
        isCorrect: isCorrect
      };
      dispatch(addResponse(response));
      currentTrial.responses.push(response);

      setCurrentDigitIndex(prevIndex => prevIndex + 1);
      showNextDigit();
    }
  }, [currentTrialIndex, currentDigitIndex, dispatch, trials, showNextDigit]);

  useEffect(() => {
    initializeTrials();
  }, [initializeTrials]);

  return { startExperiment, handleResponse, isLoading, trials, currentTrialIndex, currentDigitIndex };
}
