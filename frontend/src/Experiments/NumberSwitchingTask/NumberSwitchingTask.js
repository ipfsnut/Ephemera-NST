import React, { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentConfig, selectExperimentState, setCurrentDigit, incrementTrialIndex, addResponse } from '../../redux/configSlice';
import { setAppState } from '../../redux/globalState';
import useTrialLogic from './useTrialLogic';
import { EXPERIMENT_STATES } from '../../utils/constants';

const NumberSwitchingTask = ({ experiment }) => {
  const dispatch = useDispatch();
  const config = useSelector(selectCurrentConfig);
  const { currentTrialIndex, currentDigit, totalTrials, responses } = useSelector(selectExperimentState);

  const { startExperiment, handleResponse, isLoading, trials } = useTrialLogic(experiment, config);

  const handleKeyPress = useCallback((event) => {
    if (currentTrialIndex >= totalTrials) {
      dispatch(setAppState('EXPERIMENT_COMPLETE'));
      return;
    }

    if (currentDigit !== null) {
      if (event.key === config.KEYS.ODD || event.key === config.KEYS.EVEN) {
        const response = handleResponse(event.key);
        if (response) {
          dispatch(addResponse(response));
          
          if (response.isLastDigit) {
            const nextTrialIndex = currentTrialIndex + 1;
            dispatch(incrementTrialIndex());
            if (nextTrialIndex < totalTrials) {
              dispatch(setCurrentDigit(trials[nextTrialIndex].digits[0]));
            } else {
              dispatch(setAppState('EXPERIMENT_COMPLETE'));
            }
          } else {
            dispatch(setCurrentDigit(trials[currentTrialIndex].digits[response.digitIndex + 1]));
          }
        } else {
          dispatch(setAppState('EXPERIMENT_COMPLETE'));
        }
      }
    } else if (responses.length === 0) {
      startExperiment();
      dispatch(setCurrentDigit(trials[0].digits[0]));
    }
  }, [currentDigit, config, handleResponse, startExperiment, dispatch, currentTrialIndex, totalTrials, trials, responses]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    dispatch(setAppState('EXPERIMENT_RUNNING'));
    return () => dispatch(setAppState('READY'));
  }, [dispatch]);

  useEffect(() => {
    if (trials.length > 0 && currentDigit === null) {
      startExperiment();
      dispatch(setCurrentDigit(trials[0].digits[0]));
    }
  }, [trials, currentDigit, startExperiment, dispatch]);
  

  if (isLoading) {
    return <div>Initializing experiment...</div>;
  }

  return (
    <div className="number-switching-task">
      <h2>Number Switching Task</h2>
      {currentDigit === null && responses.length === 0 && (
        <div>
          <p>Press any key to start the experiment</p>
        </div>
      )}
      {currentDigit !== null && (
        <div>
          <p className="instructions">
            Press '{config.KEYS.ODD}' for odd numbers, '{config.KEYS.EVEN}' for even numbers
          </p>
          <p className="digit-display">{currentDigit}</p>
          <p>Trial: {currentTrialIndex + 1} / {totalTrials}</p>
        </div>
      )}
      {currentTrialIndex === totalTrials && (
        <div>Experiment Complete</div>
      )}
    </div>
  );
};

export default NumberSwitchingTask;
