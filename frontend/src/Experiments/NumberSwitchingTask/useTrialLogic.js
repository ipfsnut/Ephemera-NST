import { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  selectCurrentConfig, 
  selectExperimentState, 
  setCurrentDigit, 
  incrementTrialIndex, 
  addResponse 
} from '../../redux/configSlice';
import { setAppState } from '../../redux/globalState';
import { EXPERIMENT_STATES } from '../../utils/constants';

const log = (message, data) => console.log(`[useTrialLogic] ${message}`, data);

export default function useTrialLogic(experiment) {
  const dispatch = useDispatch();
  const config = useSelector(selectCurrentConfig);
  const { currentTrialIndex, totalTrials } = useSelector(selectExperimentState);
  const [trials, setTrials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const initializeTrials = useCallback(() => {
    log('Initializing trials', { experiment });
    if (experiment && experiment.trials) {
      const formattedTrials = experiment.trials.slice(0, config.numTrials).map(trial => ({
        digits: trial.number.toString().split('').map(Number),
        responses: [],
        startTime: null,
      }));
      setTrials(formattedTrials);
      setIsLoading(false);
      log('Trials initialized', { trialCount: formattedTrials.length, firstTrial: formattedTrials[0] });
    } else {
      log('Error: Invalid experiment data', { experiment });
      setIsLoading(false);
    }
  }, [experiment, config.numTrials]);

  useEffect(() => {
    initializeTrials();
  }, [initializeTrials]);

  const startExperiment = useCallback(() => {
    log('Starting experiment', { trialsLength: trials.length });
    if (trials.length > 0 && trials[0].digits && trials[0].digits.length > 0) {
      dispatch(setCurrentDigit(trials[0].digits[0]));
      trials[0].startTime = Date.now();
      log('First digit set', { digit: trials[0].digits[0] });
    } else {
      log('Error: Cannot start experiment with invalid trials', { trials });
    }
  }, [dispatch, trials]);

  const moveToNextTrial = useCallback(() => {
    if (currentTrialIndex < trials.length - 1) {
      dispatch(incrementTrialIndex());
      dispatch(setCurrentDigit(trials[currentTrialIndex + 1].digits[0]));
      trials[currentTrialIndex + 1].startTime = Date.now();
    } else {
      dispatch(setAppState('EXPERIMENT_COMPLETE'));
    }
  }, [currentTrialIndex, trials, dispatch, setAppState]);

  const handleResponse = useCallback((key) => {
    log('Handling response', { currentTrialIndex, trialsLength: trials.length, key });
    if (currentTrialIndex < trials.length) {
      const currentTrial = trials[currentTrialIndex];
      if (currentTrial && currentTrial.digits) {
        const digitIndex = currentTrial.responses.length;
        if (digitIndex < currentTrial.digits.length) {
          const currentDigit = currentTrial.digits[digitIndex];
          const isCorrect = (currentDigit % 2 === 0 && key === config.KEYS.EVEN) ||
                            (currentDigit % 2 !== 0 && key === config.KEYS.ODD);
          const response = {
            digit: currentDigit,
            response: key,
            responseTime: Date.now() - currentTrial.startTime,
            isCorrect: isCorrect,
            digitIndex: digitIndex,
            isLastDigit: digitIndex === currentTrial.digits.length - 1
          };
          currentTrial.responses.push(response);
          log('Response recorded', { response, remainingDigits: currentTrial.digits.length - digitIndex - 1 });
          
          if (response.isLastDigit) {
            moveToNextTrial();
          } else {
            dispatch(setCurrentDigit(currentTrial.digits[digitIndex + 1]));
          }
          
          return response;
        } else {
          log('All digits in current trial have been responded to', { currentTrial });
          return null;
        }
      } else {
        log('Invalid trial data', { currentTrial });
        return null;
      }
    } else {
      log('All trials completed', { currentTrialIndex, trialsLength: trials.length });
      return null;
    }
  }, [currentTrialIndex, trials, config.KEYS, dispatch, moveToNextTrial]);

  return { startExperiment, handleResponse, isLoading, trials, moveToNextTrial };
}
