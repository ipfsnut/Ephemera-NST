import React, { useEffect, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import ResultsDisplay from '../../components/ResultsDisplay';
import TrialDisplay from './TrialDisplay';
import { useTrialLogic } from './useTrialLogic';
import { processTrialResponse } from './trialUtils';
import { initializeCamera, queueCapture, shutdownCamera } from '../../utils/cameraManager';
import { initDB, saveTrialData, getAllTrialData, clearDatabase } from '../../utils/indexedDB';
import { createAndDownloadZip } from '../../utils/zipCreator';
import { captureAndProcessImage } from '../../utils/NumberSwitchingImage';

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
  const [trialData, setTrialData] = useState({
    image: null,
    // Add other relevant trial data fields here
  });

  useEffect(() => {
    initDB().then((database) => {
      setDB(database);
      setIsDbInitialized(true);
      console.log('Database initialized successfully');
    }).catch(error => console.error('Error initializing database:', error));
  }, []);

  const saveImage = useCallback(async (imageBlob, isInitial = false) => {
    if (!isDbInitialized) {
      console.log('Database not yet initialized, queuing image save');
      return;
    }

    const trialData = {
      trialNumber: isInitial ? 'initial' : `${currentTrialIndex}-${responses.length + 1}`,
      trialIndex: isInitial ? -1 : currentTrialIndex,
      responses: [{
        imageBlob,
        timestamp: Date.now(),
        isInitial
      }]
    };

    try {
      await saveTrialData(db, trialData);
      console.log(`${isInitial ? 'Initial' : 'Trial'} image saved successfully`);
    } catch (error) {
      console.error(`Error saving ${isInitial ? 'initial' : 'trial'} image:`, error);
    }
  }, [db, currentTrialIndex, responses.length, isDbInitialized]);
  useEffect(() => {
    initDB().then((database) => {
      setDB(database);
      return initializeCamera();
    }).then(() => {
      return queueCapture();
    }).then(imageBlob => {
      console.log('Initial photo captured, blob size:', imageBlob.size);
      return saveImage(imageBlob, true);
    }).catch(error => console.error('Error during initialization:', error));

    return () => shutdownCamera();
  }, []);
  const handleResponse = useCallback(async (response) => {
    if (experimentState === 'AWAITING_RESPONSE') {
      setKeypressCount(prevCount => {
        const newCount = prevCount + 1;
        console.log('Keypress count:', newCount);
        if (newCount % 5 === 0) {
          queueCapture().then(imageBlob => {
            if (imageBlob) {
              console.log('Image captured successfully, blob size:', imageBlob.size);
              saveResponseWithImage(imageBlob);
            }
          }).catch(error => console.error('Error capturing image:', error));
        }
        return newCount;
      });

      const newResponse = {
        digit: currentDigit,
        response: response,
        correct: (response === config.KEYS.ODD && parseInt(currentDigit) % 2 !== 0) || 
                 (response === config.KEYS.EVEN && parseInt(currentDigit) % 2 === 0),
        timestamp: Date.now()
      };

      saveResponseWithImage(null, newResponse);
      showNextDigit();
    }
  }, [experimentState, currentDigit, config.KEYS, showNextDigit]);

  const saveResponseWithImage = useCallback((imageBlob, response = null) => {
    const updatedResponses = [...responses, response || { imageBlob, timestamp: Date.now() }];
    if (db) {
      saveTrialData(db, {
        trialNumber: `${currentTrialIndex}-${updatedResponses.length}`,
        trialIndex: currentTrialIndex,
        responses: updatedResponses
      }).catch(error => console.error('Error saving trial data:', error));
    }
  }, [responses, db, currentTrialIndex]);
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
    console.log('Experiment state changed:', experimentState);
    if (experimentState === 'EXPERIMENT_COMPLETE') {
      console.log('Experiment complete, setting up download function');
      const downloadResults = async () => {
        try {
          const allTrialData = await getAllTrialData(db);
          createAndDownloadZip(allTrialData);
        } catch (error) {
          console.error('Error downloading results:', error);
        }
      };
      setDownloadFunction(() => downloadResults);
    }
  }, [experimentState, db]);

  useEffect(() => {
    if (experimentState === 'EXPERIMENT_COMPLETE') {
      console.log('Experiment complete, setting up download function');
      const downloadResults = async () => {
        try {
          const allTrialData = await getAllTrialData(db);
          await createAndDownloadZip(allTrialData);
          await clearDatabase(db);
          console.log('Database cleared after successful export');
        } catch (error) {
          console.error('Error downloading results or clearing database:', error);
        }
      };
      setDownloadFunction(() => downloadResults);
    }
  }, [experimentState, db]);

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center">
      <TrialDisplay
        currentDigit={currentDigit}
        currentTrialIndex={currentTrialIndex}
        totalTrials={trials.length}
        experimentState={experimentState}
      />
      {experimentState === 'EXPERIMENT_COMPLETE' && (
        <>
          {console.log('Rendering ResultsDisplay')}
          <ResultsDisplay
            results={responses}
            downloadResults={downloadFunction}
          />
        </>
      )}
    </div>
  );
}

export default NumberSwitchingTask;

