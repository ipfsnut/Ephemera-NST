import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { initializeCamera, queueCapture, shutdownCamera } from '../../utils/cameraManager';
import { initDB, saveTrialData } from '../../utils/indexedDB';
import ResultsDisplay from '../../components/ResultsDisplay';
import TrialDisplay from './TrialDisplay';
import { useTrialLogic } from './useTrialLogic';
import { CONFIG } from '../../config/numberSwitchingConfig';

function NumberSwitchingTask() {
  const config = useSelector(state => state.config);
  const {
    experimentState,
    currentTrialIndex,
    currentDigit,
    responses,
    startExperiment,
    handleResponse,
    trials
  } = useTrialLogic();

  const [db, setDB] = React.useState(null);
  const [cameraReady, setCameraReady] = React.useState(false);

  useEffect(() => {
    initDB().then(setDB).catch(console.error);
    initializeCamera().then(() => setCameraReady(true)).catch(console.error);
    return () => shutdownCamera().catch(console.error);
  }, []);

  useEffect(() => {
    if (experimentState === 'READY') {
      startExperiment();
    }
  }, [experimentState, startExperiment]);

  const handleKeyPress = React.useCallback((event) => {
    if (event.key === CONFIG.KEYS.ODD || event.key === CONFIG.KEYS.EVEN) {
      handleResponse(event.key);
      queueCapture().catch(console.error);
    }
  }, [handleResponse]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  if (!cameraReady) {
    return <div>Initializing camera. Please grant camera permissions to continue.</div>;
  }

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
