import React, { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';
import { setExperimentState, setCurrentTrial, setCurrentDigit } from '../../redux/eventSlice';
import ExperimentScreen from '../../components/ExperimentScreen';
import { useTrialLogic, EXPERIMENT_STATES } from './useTrialLogic';
import ResultsView from './ResultsView';

const selectExperimentState = createSelector(
  state => state.event,
  event => ({
    experimentState: event.experimentState,
    currentTrialIndex: event.currentTrialIndex,
    currentDigit: event.currentDigit,
    totalTrials: event.trials.length
  })
);

const NumberSwitchingTask = React.memo(function NumberSwitchingTask() {
  const dispatch = useDispatch();
  const config = useSelector(state => state.config.currentConfig);
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
        <ResultsView experimentId={experimentId} />
      )}
    </div>
  );});

export default NumberSwitchingTask;