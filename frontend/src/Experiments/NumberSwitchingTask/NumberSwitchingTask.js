import React, { useEffect, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchExperiment, createExperiment } from '../../redux/eventSlice';
import TrialDisplay from './TrialDisplay';
import { useTrialLogic } from './useTrialLogic';
import { processTrialResponse } from './trialUtils';
import { initializeCamera, queueCapture, shutdownCamera } from '../../utils/cameraManager';
import ResultsView from './ResultsView';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5069';

function NumberSwitchingTask() {
  const dispatch = useDispatch();
  const config = useSelector(state => state.config);
  const { currentExperiment } = useSelector(state => state.event);
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

  const [keypressCount, setKeypressCount] = useState(0);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    dispatch(fetchExperiment('nst'));
    initializeCamera().catch(error => console.error('Error initializing camera:', error));
    return () => shutdownCamera();
  }, [dispatch]);

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
    const fullResponse = {
      experimentId: currentExperiment.id,
      trialIndex: currentTrialIndex,
      ...responseData,
      timestamp: Date.now()
    };

    try {
      const formData = new FormData();
      formData.append('response', JSON.stringify(fullResponse));
      if (imageBlob) {
        formData.append('image', imageBlob, 'response-image.jpg');
      }
      await axios.post(`${API_BASE_URL}/api/experiments/${currentExperiment.id}/responses`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      console.log('Response saved successfully');
    } catch (error) {
      console.error('Error saving trial data:', error);
    }
  }, [currentExperiment, currentTrialIndex]);

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
    if (experimentState === 'READY' && currentExperiment) {
      startExperiment();
    }
  }, [experimentState, startExperiment, currentExperiment]);

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
        <ResultsView experimentId={currentExperiment.id} />
      )}
    </div>
  );
}

export default NumberSwitchingTask;
