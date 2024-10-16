import React, { useEffect, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import ResultsDisplay from '../../components/ResultsDisplay';
import TrialDisplay from './TrialDisplay';
import { useTrialLogic } from './useTrialLogic';
import { processTrialResponse } from './trialUtils';
import { initializeCamera, queueCapture, shutdownCamera } from '../../utils/cameraManager';
import { initDB, saveTrialData, getAllTrialData, clearDatabase } from '../../utils/indexedDB';
import { createAndDownloadZip } from '../../utils/zipCreator';
import ResultsView from './ResultsView';


function NumberSwitchingTask() {
  const config = useSelector(state => state.config);
  const {
    experimentState,
    currentTrialIndex,
    currentDigit,
    responses,
    startExperiment,
    showNextDigit,
    setCurrentDigitIndex,
    setExperimentState,
    trials
  } = useTrialLogic();

  const [db, setDB] = useState(null);
  const [keypressCount, setKeypressCount] = useState(0);
  const [downloadFunction, setDownloadFunction] = useState(null);
  const [isDbInitialized, setIsDbInitialized] = useState(false);
  const [showResults, setShowResults] = useState(false);



  useEffect(() => {
    initDB().then((database) => {
      setDB(database);
      setIsDbInitialized(true);
      return initializeCamera();
    }).catch(error => console.error('Error during initialization:', error));
  }, []);

  const captureImage = useCallback(async () => {
    try {
      const imageBlob = await queueCapture();
      console.log('Image captured successfully, blob size:', imageBlob.size);
      return imageBlob;
    } catch (error) {
      console.error('Error capturing image:', error);
      return null;
    }
  }, []);
  const saveResponseWithImage = useCallback(async (responseData, imageBlob) => {
    if (!isDbInitialized) {
      console.log('Database not yet initialized, queuing response save');
      return;
    }

    const fullResponse = {
      id: `${currentTrialIndex}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      trialIndex: currentTrialIndex,
      ...responseData,
      imageBlob: imageBlob,
      timestamp: Date.now()
    };

    if (db) {
      try {
        await saveTrialData(db, fullResponse);
        console.log(`Response saved successfully. Image blob size: ${imageBlob ? imageBlob.size : 'N/A'}`);
      } catch (error) {
        console.error('Error saving trial data:', error);
      }
    }
  }, [db, currentTrialIndex, isDbInitialized]);
  const handleResponse = useCallback(async (response) => {
    if (experimentState === 'AWAITING_RESPONSE') {
      setKeypressCount(prevCount => prevCount + 1);

      const processedResponse = processTrialResponse(currentDigit, response, config.KEYS);
      const responseData = {
        ...processedResponse,
        timestamp: Date.now()
      };

      let imageBlob = null;
      if (keypressCount % 5 === 0) {
        imageBlob = await captureImage();
      }

      await saveResponseWithImage(responseData, imageBlob);
      showNextDigit();
    }
  }, [experimentState, currentDigit, config.KEYS, showNextDigit, keypressCount, captureImage, saveResponseWithImage]);

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
    if (experimentState === 'SHOWING_DIGIT') {
      showNextDigit();
    }
  }, [experimentState, showNextDigit]);

  useEffect(() => {
    if (experimentState === 'READY') {
      startExperiment();
    }
  }, [experimentState, startExperiment]);

  useEffect(() => {
    if (experimentState === 'EXPERIMENT_COMPLETE') {
      shutdownCamera();
      console.log('Camera shut down after experiment completion');
      setShowResults(true);
    }
  }, [experimentState]);
  

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center">
      {!showResults ? (
        <TrialDisplay
          currentDigit={currentDigit}
          currentTrialIndex={currentTrialIndex}
          totalTrials={trials.length}
          experimentState={experimentState}
        />
      ) : (
        <ResultsView db={db} onExport={downloadFunction} />
      )}
    </div>
  );
  
}

export default NumberSwitchingTask;