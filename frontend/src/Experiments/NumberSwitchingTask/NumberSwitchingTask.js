import React, { useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import ResultsDisplay from '../../components/ResultsDisplay';
import TrialDisplay from './TrialDisplay';
import { useTrialLogic } from './useTrialLogic';
import { processTrialResponse } from './trialUtils';
import { initDB, saveTrialData } from '../../utils/indexedDB';

function NumberSwitchingTask() {
  const config = useSelector(state => state.config);
  const {
    experimentState,
    currentTrialIndex,
    currentDigit,
    responses,
    startExperiment,
    setResponses,
    setCurrentDigitIndex,
    setExperimentState,
    trials
  } = useTrialLogic();

  const [db, setDB] = React.useState(null);

  useEffect(() => {
    initDB().then(setDB).catch(console.error);
  }, []);

  const handleResponse = useCallback((response) => {
    if (experimentState === 'AWAITING_RESPONSE') {
      const newResponse = processTrialResponse(currentDigit, response, config.KEYS);
      setResponses(prevResponses => {
        const updatedResponses = [...prevResponses, newResponse];
        if (db) {
          saveTrialData(db, {
            trialIndex: currentTrialIndex,
            responses: updatedResponses
          }).catch(console.error);
        }
        return updatedResponses;
      });
      setCurrentDigitIndex(prevIndex => prevIndex + 1);
      setExperimentState('SHOWING_DIGIT');
    }
  }, [experimentState, currentDigit, config.KEYS, setResponses, setCurrentDigitIndex, setExperimentState, db, currentTrialIndex]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === config.KEYS.ODD || event.key === config.KEYS.EVEN) {
        handleResponse(event.key);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleResponse, config.KEYS]);

  useEffect(() => {
    if (experimentState === 'READY') {
      startExperiment();
    }
  }, [experimentState, startExperiment]);

  if (experimentState === 'EXPERIMENT_COMPLETE') {
    return <ResultsDisplay db={db} />;
  }

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center">
      <TrialDisplay
        currentDigit={currentDigit}
        currentTrialIndex={currentTrialIndex}
        totalTrials={trials.length}
        experimentState={experimentState}
      />
    </div>
  );
}

export default NumberSwitchingTask;