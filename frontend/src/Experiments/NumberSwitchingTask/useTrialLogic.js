import { useState, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setExperimentState, setCurrentDigit, addResponse, setCurrentTrialIndex } from '../../redux/eventSlice';
import { EXPERIMENT_STATES } from '../../utils/constants';


export default function useTrialLogic(experiment, config) {
  const dispatch = useDispatch();
  const [trials, setTrials] = useState([]);
  const [currentTrialIndex, setCurrentTrialIndex] = useState(0);
  const [currentDigitIndex, setCurrentDigitIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentDigit, setCurrentDigit] = useState(null);

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

  useEffect(() => {
    initializeTrials();
  }, [initializeTrials]);

  const showNextDigit = useCallback(() => {
    console.log('showNextDigit called', { currentTrialIndex, trials });
    if (currentTrialIndex < trials.length) {
      const currentTrial = trials[currentTrialIndex];
      if (currentDigitIndex < currentTrial.digits.length) {
        console.log('Dispatching setExperimentState');
        dispatch(setExperimentState('SHOWING_DIGIT'));
        dispatch(setCurrentDigit(currentTrial.digits[currentDigitIndex]));
        if (currentDigitIndex === 0) {
          currentTrial.startTime = Date.now();
          console.log('Dispatching setCurrentTrialIndex', currentTrialIndex);
          console.log('setCurrentTrialIndex action:', setCurrentTrialIndex);
          dispatch(setCurrentTrialIndexAction(currentTrialIndex));
        }
      } else {
        const nextTrialIndex = currentTrialIndex + 1;
        if (nextTrialIndex < trials.length) {
          setCurrentTrialIndex(nextTrialIndex);
          setCurrentDigitIndex(0);
          console.log('Dispatching setExperimentState for next trial');
          dispatch(setExperimentState('SHOWING_DIGIT'));
          console.log('Dispatching setCurrentDigit for next trial', trials[nextTrialIndex].digits[0]);
          dispatch(setCurrentDigit(trials[nextTrialIndex].digits[0]));
          console.log('Dispatching setCurrentTrialIndex for next trial', nextTrialIndex);
          dispatch(setCurrentTrialIndexAction(nextTrialIndex));
          trials[nextTrialIndex].startTime = Date.now();
        } else {
          console.log('Dispatching EXPERIMENT_COMPLETE');
          dispatch(setExperimentState('EXPERIMENT_COMPLETE'));
        }
      }
    } else {
      console.log('Dispatching final EXPERIMENT_COMPLETE');
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

  return { startExperiment, handleResponse, isLoading, trials };
}