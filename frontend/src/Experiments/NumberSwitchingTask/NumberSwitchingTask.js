import React, { useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import ExperimentScreen from '../../components/ExperimentScreen';
import { useTrialLogic } from './useTrialLogic';
import ResultsView from './ResultsView';

const NumberSwitchingTask = React.memo(function NumberSwitchingTask() {
  const config = useSelector(state => state.config.currentConfig);
  const {
    experimentState,
    currentTrialIndex,
    currentDigit,
    startExperiment,
    handleResponse,
    trials,
    isLoading
  } = useTrialLogic();
  console.log('Rendering NumberSwitchingTask, experimentState:', experimentState);

  const handleKeyPress = useCallback((event) => {
    console.log('Key pressed:', event.key);
    if (experimentState === 'AWAITING_RESPONSE') {
      if (event.key === config.KEYS.ODD || event.key === config.KEYS.EVEN) {
        handleResponse(event.key);
      }
    } else if (experimentState === 'READY') {
      startExperiment();
    }
  }, [experimentState, config.KEYS, handleResponse, startExperiment]);

  useEffect(() => {
    console.log('experimentState:', experimentState);
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    console.log('experimentState:', experimentState);
    if (trials.length > 0 && experimentState === 'READY') {
      startExperiment();
    }
  }, [trials, experimentState, startExperiment]);

  if (isLoading) {
    return <div>Loading experiment...</div>;
  }

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center">
      {experimentState !== 'EXPERIMENT_COMPLETE' ? (
        <ExperimentScreen
          experimentType="NumberSwitchingTask"
          currentDigit={currentDigit}
          currentTrialIndex={currentTrialIndex}
          totalTrials={trials.length}
          experimentState={experimentState}
        />
      ) : (
        <ResultsView />
      )}
    </div>
  );
});

export default NumberSwitchingTask;