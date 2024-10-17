import React, { useEffect, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchEvent, saveExperimentResponse } from '../../redux/eventSlice';
import TrialDisplay from './TrialDisplay';
import { useTrialLogic } from './useTrialLogic';
import { processTrialResponse } from './trialUtils';
import { initializeCamera, queueCapture, shutdownCamera } from '../../utils/cameraManager';
import ResultsView from './ResultsView';

function NumberSwitchingTask() {
  const dispatch = useDispatch();
  const config = useSelector(state => state.config);
  const { currentEvent, status } = useSelector(state => state.event);
  const {
    experimentState,
    currentTrialIndex,
    currentDigit,
    startExperiment,
    showNextDigit,
    trials
  } = useTrialLogic();

  const [keypressCount, setKeypressCount] = useState(0);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const initializeExperiment = async () => {
      const nstEventId = 'nst'; // Assuming 'nst' is the ID for Number Switching Task
      await dispatch(fetchEvent(nstEventId));
    };
    
    initializeExperiment();
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
    if (!currentEvent || !currentEvent._id) {
      console.error('No current event found');
      return;
    }

    const fullResponse = {
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
      await dispatch(saveExperimentResponse({ id: currentEvent._id, responseData: formData }));
    } catch (error) {
      console.error('Error saving response:', error);
    }
  }, [currentEvent, currentTrialIndex, dispatch]);

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
    if (experimentState === 'READY' && currentEvent) {
      startExperiment();
    }
  }, [experimentState, startExperiment, currentEvent]);

  useEffect(() => {
    if (experimentState === 'EXPERIMENT_COMPLETE') {
      shutdownCamera();
      console.log('Camera shut down after experiment completion');
      setShowResults(true);
    }
  }, [experimentState]);

  if (status === 'loading') {
    return <div>Loading experiment...</div>;
  }

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
        <ResultsView eventId={currentEvent._id} />
      )}
    </div>
  );
}

export default NumberSwitchingTask;