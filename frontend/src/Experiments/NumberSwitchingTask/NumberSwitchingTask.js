import React, { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setAppState } from '../../redux/globalState';
import { setExperimentState, selectExperimentState, initializeExperiment } from '../../redux/eventSlice';
import { EXPERIMENT_STATES } from '../../utils/constants';
import useTrialLogic from './useTrialLogic';

const NumberSwitchingTask = React.memo(function NumberSwitchingTask({ experiment }) {
  const dispatch = useDispatch();
  const { experimentState, currentTrialIndex, currentDigit, totalTrials } = useSelector(selectExperimentState);
  const config = experiment.configuration;

  const { startExperiment, handleResponse, isLoading, experimentId, trials } = useTrialLogic(experiment);

  const handleKeyPress = useCallback((event) => {
    if (experimentState === 'AWAITING_RESPONSE') {
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
  if (experimentState === EXPERIMENT_STATES.INITIALIZING) {
    return <div>Initializing experiment...</div>;
  }

  if (isLoading) {
    return <div>Loading experiment...</div>;
  }

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center">
      {experimentState !== EXPERIMENT_STATES.EXPERIMENT_COMPLETE ? (
        <div>
          <h2>Number Switching Task</h2>
          <p>Current Digit: {currentDigit}</p>
          <p>Trial: {currentTrialIndex + 1} / {totalTrials}</p>
          <p>State: {experimentState}</p>
        </div>
      ) : (
        <div>Experiment Complete</div>
      )}
    </div>
  );
});


export default NumberSwitchingTask;