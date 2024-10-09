import React, { useState, useEffect, useCallback } from 'react';
import '../styles/ExperimentScreen.css';
import { initializeCamera, queueCapture, shutdownCamera } from '../utils/cameraManager';
import { initDB, saveTrialData, getAllTrialData } from '../utils/indexedDB';
import ResultsDisplay from '../components/ResultsDisplay';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { generateTrialNumbers } from '../utils/markovChain';
import { CONFIG } from '../config/numberSwitchingConfig';
import './NumberSwitchingTask.css';


function NumberSwitchingTask() {
  const [currentTrial, setCurrentTrial] = useState(1);
  const [digits, setDigits] = useState([]);
  const [currentDigit, setCurrentDigit] = useState(null);
  const [currentDigitIndex, setCurrentDigitIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [db, setDB] = useState(null);
  const [experimentComplete, setExperimentComplete] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [trialData, setTrialData] = useState([]);
  const [trialNumbers, setTrialNumbers] = useState([]);
  const [currentEffortLevel, setCurrentEffortLevel] = useState('');
  const [isExperimentStarted, setIsExperimentStarted] = useState(false);
  const [currentTrialIndex, setCurrentTrialIndex] = useState(0);
  const [keypressCount, setKeypressCount] = useState(0);
  const [cameraReady, setCameraReady] = useState(false);
  const [canRespond, setCanRespond] = useState(false);

  useEffect(() => {
    console.log('Initializing NumberSwitchingTask');
    initDB().then(setDB).catch(console.error);
    initializeCamera()
      .then(() => setCameraReady(true))
      .catch(error => {
        console.error('Camera initialization failed:', error);
        setCameraReady(false);
      });
    const generatedTrialNumbers = generateTrialNumbers();
    console.log('Generated trial numbers:', generatedTrialNumbers);
    setTrialNumbers(generatedTrialNumbers);
    return () => shutdownCamera();
  }, []);

  useEffect(() => {
    if (trialNumbers.length > 0 && !isExperimentStarted) {
      setIsExperimentStarted(true);
      startTrial();
    }
  }, [trialNumbers, isExperimentStarted]);

  const startTrial = useCallback(() => {
    if (currentTrialIndex < CONFIG.TOTAL_TRIALS) {
      setCurrentEffortLevel(trialNumbers[currentTrialIndex].effortLevel);
      setCurrentDigitIndex(0);
      setResponses([]);
      showNextDigit();
    } else {
      setExperimentComplete(true);
    }
  }, [currentTrialIndex, trialNumbers]);

  const showNextDigit = useCallback(() => {
    if (currentDigitIndex < CONFIG.DIGITS_PER_TRIAL) {
      const digit = trialNumbers[currentTrialIndex].number[currentDigitIndex];
      setCurrentDigit(digit);
      setCurrentDigitIndex(prevIndex => prevIndex + 1);
      setCanRespond(false);
      setTimeout(() => setCanRespond(true), CONFIG.DIGIT_DISPLAY_TIME);
    } else {
      endTrial();
    }
  }, [currentTrialIndex, currentDigitIndex, trialNumbers]);

  useEffect(() => {
    if (trialNumbers.length > 0) {
      const currentTrialDigits = trialNumbers[currentTrial - 1].number.split('');
      console.log('Setting digits for trial', currentTrial, ':', currentTrialDigits);
      setDigits(currentTrialDigits);
      setCurrentEffortLevel(trialNumbers[currentTrial - 1].effortLevel);
      setCurrentDigitIndex(0);
      setResponses([]);
    }
  }, [currentTrial, trialNumbers]);

  const handleKeyPress = useCallback((event) => {
    if (canRespond && (event.key === CONFIG.KEYS.ODD || event.key === CONFIG.KEYS.EVEN)) {
      setKeypressCount(prevCount => prevCount + 1);
      if (keypressCount % 3 === 2) {
        queueCapture().catch(console.error);
      }

      console.log('Before update - Current digit index:', currentDigitIndex);
      const isOdd = parseInt(currentDigit) % 2 !== 0;
      const isCorrect = (event.key === CONFIG.KEYS.ODD && isOdd) || (event.key === CONFIG.KEYS.EVEN && !isOdd);
      
      const newResponse = { 
        trialNumber: currentTrial,
        digitIndex: currentDigitIndex - 1,
        digit: currentDigit, 
        response: event.key, 
        correct: isCorrect,
        responseTime: performance.now()
      };
      
      setResponses(prevResponses => [...prevResponses, newResponse]);
      
      showNextDigit();
    }
  }, [canRespond, currentDigit, currentDigitIndex, currentTrial, showNextDigit, keypressCount]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const endTrial = async () => {
    console.log('Ending trial', currentTrial);
    const allCorrect = responses.every(response => response.correct);
    let imageBlob = null;

    if (allCorrect) {
      try {
        imageBlob = await queueCapture();
      } catch (error) {
        console.error('Failed to take picture:', error);
      }
    }

    const newTrialData = {
      trialNumber: currentTrial,
      responses: responses,
      allCorrect: allCorrect,
      imageBlob: imageBlob,
      effortLevel: currentEffortLevel
    };

    setTrialData(prevData => [...prevData, newTrialData]);
    await saveTrialData(db, newTrialData);

    setCurrentTrialIndex(prevIndex => prevIndex + 1);
    if (currentTrialIndex + 1 < CONFIG.TOTAL_TRIALS) {
      setTimeout(startTrial, CONFIG.INTER_TRIAL_DELAY);
    } else {
      setExperimentComplete(true);
    }
  };

  const exportData = async () => {
    const zip = new JSZip();
    let csvContent = "Trial Number,Effort Level,All Correct,Image Name,Responses\n";

    const allTrialData = await getAllTrialData(db);

    allTrialData.forEach((trial) => {
      const imageName = trial.imageBlob ? `Image${trial.trialNumber}.${trial.effortLevel}.jpg` : 'No Image';
      csvContent += `${trial.trialNumber},${trial.effortLevel},${trial.allCorrect},${imageName},`;
      csvContent += trial.responses.map(r => `${r.digit}:${r.response}:${r.correct}`).join('|');
      csvContent += "\n";

      if (trial.imageBlob) {
        zip.file(imageName, trial.imageBlob);
      }
    });

    zip.file("experiment_data.csv", csvContent);

    const zipBlob = await zip.generateAsync({type: "blob"});
    saveAs(zipBlob, "experiment_results.zip");
  };

  if (!cameraReady) {
    return <div>Initializing camera. Please grant camera permissions to continue.</div>;
  }

  if (experimentComplete) {
    return <ResultsDisplay db={db} onExport={exportData} />;
  }

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center">
      {!isExperimentStarted ? (
        <div>Preparing experiment...</div>
      ) : (
        <>
          <div className="digit-display">{currentDigit}</div>
          <p className="text-xl">
            Press '{CONFIG.KEYS.ODD}' for odd numbers, '{CONFIG.KEYS.EVEN}' for even numbers
          </p>
          <p>Trial: {currentTrialIndex + 1} / {CONFIG.TOTAL_TRIALS}</p>
        </>
      )}
    </div>
  );
}

export default NumberSwitchingTask;