import React, { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setAppState } from '../../redux/globalState';
import { setExperimentState, selectExperimentState } from '../../redux/eventSlice';
import { EXPERIMENT_STATES } from '../../utils/constants';
import ExperimentScreen from '../../components/ExperimentScreen';
import useTrialLogic from './useTrialLogic';
import { initialConfig } from './config';

const NumberSwitchingTask = React.memo(function NumberSwitchingTask() {
  const dispatch = useDispatch();
  const config = useSelector(state => state.config.currentConfig) || initialConfig;
  const { experimentState, currentTrialIndex, currentDigit, totalTrials } = useSelector(selectExperimentState);
  const { startExperiment, handleResponse, isLoading, experimentId, trials } = useTrialLogic();

  const handleKeyPress = useCallback((event) => {
    if (experimentState === 'AWAITING_RESPONSE') {
      if (event.key === config.KEYS.ODD || event.key === config.KEYS.EVEN) {
        handleResponse(event.key);
      }
    } else if (experimentState === 'READY') {
      dispatch(setExperimentState('SHOWING_DIGIT'));
      startExperiment();
    }
  }, [experimentState, config.KEYS, handleResponse, startExperiment, dispatch]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    console.log('experimentState:', experimentState);
    if (trials.length > 0 && experimentState === 'READY' && currentTrialIndex === 0) {
      startExperiment();
    }
  }, [trials, experimentState, startExperiment, currentTrialIndex]);

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
        <ExperimentScreen
          experimentType="NumberSwitchingTask"
          currentDigit={currentDigit}
          currentTrialIndex={currentTrialIndex}
          totalTrials={totalTrials}
          experimentState={experimentState}
        />
      ) : (
        <div>Experiment Complete</div>
      )}
    </div>
  );
});

export default NumberSwitchingTask;