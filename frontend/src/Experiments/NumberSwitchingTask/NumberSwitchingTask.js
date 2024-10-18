import React, { useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import TrialDisplay from './TrialDisplay';
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

  const handleKeyPress = useCallback((event) => {
    if (experimentState === 'AWAITING_RESPONSE') {
      if (event.key === config.KEYS.ODD || event.key === config.KEYS.EVEN) {
        handleResponse(event.key);
      }
    } else if (experimentState === 'READY') {
      startExperiment();
    }
  }, [experimentState, config.KEYS, handleResponse, startExperiment]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
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
        <TrialDisplay
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


