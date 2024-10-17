import React, { useEffect, useCallback, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchEvent } from '../../redux/eventSlice';
import TrialDisplay from './TrialDisplay';
import { useTrialLogic } from './useTrialLogic';
import { processTrialResponse } from './trialUtils';
import { initializeCamera, queueCapture, shutdownCamera } from '../../utils/cameraManager';
import ResultsView from './ResultsView';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5069';

const NumberSwitchingTask = React.memo(function NumberSwitchingTask() {
  const dispatch = useDispatch();
  const config = useSelector(state => state.config.currentConfig);
  const { currentExperiment } = useSelector(state => state.event);
  const {
    experimentState,
    currentTrialIndex,
    currentDigit,
    responses,
    startExperiment,
    showNextDigit,
    setExperimentState,
    trials
  } = useTrialLogic();

  const [keypressCount, setKeypressCount] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const showNextDigitRef = useRef(false);

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
    if (!currentExperiment || !currentExperiment._id) {
      console.error('No current experiment found');
      return;
    }

    const fullResponse = {
      experimentId: currentExperiment._id,
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
      const response = await axios.post(`${API_BASE_URL}/api/experiments/${currentExperiment._id}/responses`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log('Response saved:', response.data);
    } catch (error) {
      console.error('Error saving response:', error);
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
      showNextDigitRef.current = true;
      setExperimentState('SHOWING_DIGIT');
    }
  }, [experimentState, currentDigit, config.KEYS, keypressCount, captureImage, saveResponseWithImage, setExperimentState]);

  useEffect(() => {
    console.log('Effect: Fetching event and initializing camera');
    if (!currentExperiment) {
      dispatch(fetchEvent('nst'));
    }
    initializeCamera().catch(error => console.error('Error initializing camera:', error));
    return () => shutdownCamera();
  }, [dispatch, currentExperiment]);

  useEffect(() => {
    console.log('Effect: Handling experiment state and showing next digit');
    if (experimentState === 'SHOWING_DIGIT' && showNextDigitRef.current) {
      showNextDigit();
      showNextDigitRef.current = false;
    }
  }, [experimentState, showNextDigit]);

  useEffect(() => {
    console.log('Effect: Handling key press');
    const handleKeyPress = (event) => {
      if (event.key === config.KEYS.ODD || event.key === config.KEYS.EVEN) {
        handleResponse(event.key);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleResponse, config.KEYS]);

  useEffect(() => {
    console.log('Effect: Handling experiment state and showing next digit');
    if (experimentState === 'SHOWING_DIGIT') {
      showNextDigit();
    }
  }, [experimentState, showNextDigit]);

  useEffect(() => {
    console.log('Effect: Starting experiment if ready');
    if (experimentState === 'READY' && currentExperiment) {
      startExperiment();
    }
  }, [experimentState, startExperiment, currentExperiment]);

  useEffect(() => {
    console.log('Effect: Handling experiment completion');
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
});

export default NumberSwitchingTask;
