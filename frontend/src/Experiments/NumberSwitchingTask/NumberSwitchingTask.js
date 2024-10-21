import React, { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setAppState } from '../../redux/globalState';
import { setExperimentState, selectExperimentState, initializeExperiment } from '../../redux/eventSlice';
import { EXPERIMENT_STATES } from '../../utils/constants';
import useTrialLogic from './useTrialLogic';
import { initialConfig as experimentConfig } from './config';

const NumberSwitchingTask = ({ experiment }) => {
  const dispatch = useDispatch();
  const { experimentState, currentTrialIndex, currentDigit, totalTrials } = useSelector(selectExperimentState);
  const config = experimentConfig;

  const { startExperiment, handleResponse, isLoading, trials, currentDigitIndex } = useTrialLogic(experiment);

  const handleKeyPress = useCallback((event) => {
    console.log('Key pressed:', event.key);
    if (experimentState === 'AWAITING_RESPONSE' || experimentState === 'SHOWING_DIGIT') {
      if (event.key === config.KEYS.ODD || event.key === config.KEYS.EVEN) {
        handleResponse(event.key);
      }
    } else if (experimentState === 'READY') {
      dispatch(setExperimentState('SHOWING_DIGIT'));
      startExperiment();
    }
  }, [experimentState, config, handleResponse, startExperiment, dispatch]);

  useEffect(() => {
    dispatch(initializeExperiment(experiment));
  }, [dispatch, experiment]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    console.log('experimentState:', experimentState);
    if (experiment.trials.length > 0 && experimentState === 'READY' && currentTrialIndex === 0) {
      startExperiment();
    }
  }, [experiment, experimentState, startExperiment, currentTrialIndex]);

  useEffect(() => {
    dispatch(setAppState('EXPERIMENT_RUNNING'));
    return () => dispatch(setAppState('READY'));
  }, [dispatch]);

  if (experimentState === EXPERIMENT_STATES.INITIALIZING || isLoading) {
    return <div>Initializing experiment...</div>;
  }

  return (
    <div className="number-switching-task">
      <h2>Number Switching Task</h2>
      {experimentState === 'READY' && (
        <div>
          <p>Press any key to start the experiment</p>
        </div>
      )}
      {(experimentState === 'SHOWING_DIGIT' || experimentState === 'AWAITING_RESPONSE') && (
        <div>
          <p className="instructions">
            Press '{config.KEYS.ODD}' for odd numbers, '{config.KEYS.EVEN}' for even numbers
          </p>
          <p className="digit-display">{currentDigit}</p>
          <p>Trial: {currentTrialIndex + 1} / {totalTrials}</p>
          <p>Digit: {currentDigitIndex + 1} / 15</p>
        </div>
      )}
      {experimentState === 'EXPERIMENT_COMPLETE' && (
        <div>Experiment Complete</div>
      )}
    </div>
  );
};

export default NumberSwitchingTask;