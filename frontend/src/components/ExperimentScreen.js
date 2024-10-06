import React, { useState, useEffect, useCallback } from 'react';
import '../styles/ExperimentScreen.css';
import { initializeCamera, queueCapture, shutdownCamera } from '../utils/cameraManager';
import { initDB, saveTrialData, getAllTrialData } from '../utils/indexedDB';
import ResultsDisplay from './ResultsDisplay';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { generateTrialNumbers } from '../utils/markovChain';
import { CONFIG } from '../config/numberSwitchingConfig';

function ExperimentScreen() {
  const [currentTrial, setCurrentTrial] = useState(1);
  const [digits, setDigits] = useState([]);
  const [currentDigitIndex, setCurrentDigitIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [db, setDB] = useState(null);
  const [experimentComplete, setExperimentComplete] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [trialData, setTrialData] = useState([]);
  const [trialNumbers, setTrialNumbers] = useState([]);
  const [currentEffortLevel, setCurrentEffortLevel] = useState('');

  useEffect(() => {
    initDB().then(setDB).catch(console.error);
    initializeCamera().then(() => setCameraPermission(true)).catch(console.error);
    setTrialNumbers(generateTrialNumbers());

    return () => {
      shutdownCamera();
    };
  }, []);

  useEffect(() => {
    if (trialNumbers.length > 0) {
      setDigits(trialNumbers[currentTrial - 1].number.split(''));
      setCurrentEffortLevel(trialNumbers[currentTrial - 1].effortLevel);
      setCurrentDigitIndex(0);
      setResponses([]);
    }
  }, [currentTrial, trialNumbers]);

  const handleKeyPress = useCallback((event) => {
    if (event.key === CONFIG.KEYS.ODD || event.key === CONFIG.KEYS.EVEN) {
      const isOdd = parseInt(digits[currentDigitIndex]) % 2 !== 0;
      const isCorrect = (event.key === CONFIG.KEYS.ODD && isOdd) || (event.key === CONFIG.KEYS.EVEN && !isOdd);
      
      const newResponse = { 
        trialNumber: currentTrial,
        digitIndex: currentDigitIndex,
        digit: digits[currentDigitIndex], 
        response: event.key, 
        correct: isCorrect,
        responseTime: performance.now()
      };
      
      setResponses(prevResponses => [...prevResponses, newResponse]);
      
      if (currentDigitIndex < CONFIG.DIGITS_PER_TRIAL - 1) {  
        setCurrentDigitIndex(currentDigitIndex + 1);
      } else {
        endTrial();
      }
    }
  }, [digits, currentDigitIndex, currentTrial]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  const endTrial = async () => {
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

    // Save trial data to IndexedDB
    await saveTrialData(db, newTrialData);

    if (currentTrial < CONFIG.TOTAL_TRIALS) {
      setTimeout(() => {
        setCurrentTrial(currentTrial + 1);
        setCurrentDigitIndex(0);
        setResponses([]);
      }, CONFIG.INTER_TRIAL_DELAY);
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

  if (!cameraPermission) {
    return <div>Please grant camera permission to continue with the experiment.</div>;
  }

  if (experimentComplete) {
    return <ResultsDisplay db={db} onExport={exportData} />;
  }

  return (
    <div className="experiment-screen">
      <h2>Trial {currentTrial} of {CONFIG.TOTAL_TRIALS}</h2>
      <div className="number-display">
        <span className="highlighted">{digits[currentDigitIndex]}</span>
      </div>
      <p>Press '{CONFIG.KEYS.ODD}' for odd numbers, '{CONFIG.KEYS.EVEN}' for even numbers</p>
    </div>
  );
}

export default ExperimentScreen;