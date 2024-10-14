import React, { useEffect, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import ResultsDisplay from '../../components/ResultsDisplay';
import TrialDisplay from './TrialDisplay';
import { useTrialLogic } from './useTrialLogic';
import { processTrialResponse } from './trialUtils';
import { initializeCamera, captureImage, shutdownCamera } from '../../utils/cameraManager';
import ResultsDownloader from './ResultsDownloader';
import { initDB, saveTrialData, getAllTrialData } from '../../utils/indexedDB';
import { createAndDownloadZip } from '../../utils/zipCreator';




function NumberSwitchingTask() {
  const config = useSelector(state => state.config);
  const {
    experimentState,
    currentTrialIndex,
    currentDigit,
    responses,
    startExperiment,
    showNextDigit,
    setResponses,
    setCurrentDigitIndex,
    setExperimentState,
    trials
  } = useTrialLogic();

  const [db, setDB] = React.useState(null);
  const [keypressCount, setKeypressCount] = useState(0);
  const [downloadFunction, setDownloadFunction] = useState(null);
  useEffect(() => {
    initDB().then(setDB).catch(console.error);
  }, []);

  useEffect(() => {
    initializeCamera().then(() => {
      captureImage();
      console.log('initial photo captured') // Initial photo at the start of the experiment
    });
    return () => shutdownCamera();
  }, []);

  const handleResponse = useCallback(async (response) => {
    if (experimentState === 'AWAITING_RESPONSE') {
      setKeypressCount(prevCount => {
        const newCount = prevCount + 1;
        console.log('Keypress count:', newCount);
        if (newCount % 5 === 0) {
          console.log('Attempting to capture image');
          captureImage().then(blob => {
            console.log('Image captured, blob size:', blob.size);
            saveTrialData(db, {
              trialNumber: `${currentTrialIndex}-${responses.length + 1}`,
              trialIndex: currentTrialIndex,
              responses: [...responses, newResponse],
              imageBlob: blob
            }).catch(error => console.error('Error saving trial data with image:', error));
          }).catch(error => console.error('Error capturing image:', error));
        }
        return newCount;
      });

      const newResponse = processTrialResponse(currentDigit, response, config.KEYS);
      const updatedResponses = [...responses, newResponse];
      
      if (db) {
        await saveTrialData(db, {
          trialNumber: `${currentTrialIndex}-${updatedResponses.length}`,
          trialIndex: currentTrialIndex,
          responses: updatedResponses
        }).catch(error => console.error('Error saving trial data:', error));
      }

      showNextDigit();
    }
  }, [experimentState, currentDigit, config.KEYS, responses, db, currentTrialIndex, showNextDigit]);

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
  );}export default NumberSwitchingTask;


