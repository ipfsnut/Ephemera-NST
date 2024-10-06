import React, { useState, useEffect, useCallback } from 'react';
import { generateTrialNumbers } from '../utils/markovChain';
import { CONFIG } from '../config/numberSwitchingConfig';
import { initDB, saveTrialData } from '../utils/indexedDB';
import './NumberSwitchingTask.css';

const NumberSwitchingTask = () => {
  const [trialNumbers, setTrialNumbers] = useState([]);
  const [currentTrialIndex, setCurrentTrialIndex] = useState(0);
  const [currentNumber, setCurrentNumber] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [db, setDB] = useState(null);
  const [isExperimentComplete, setIsExperimentComplete] = useState(false);

  useEffect(() => {
    initDB().then(setDB);
    setTrialNumbers(generateTrialNumbers());
  }, []);

  useEffect(() => {
    if (trialNumbers.length > 0 && currentTrialIndex < CONFIG.TOTAL_TRIALS) {
      setCurrentNumber(trialNumbers[currentTrialIndex].number);
      setStartTime(Date.now());
    } else if (currentTrialIndex >= CONFIG.TOTAL_TRIALS) {
      setIsExperimentComplete(true);
    }
  }, [trialNumbers, currentTrialIndex]);

  const handleKeyPress = useCallback((event) => {
    if ((event.key === CONFIG.KEYS.ODD || event.key === CONFIG.KEYS.EVEN) && currentNumber !== null) {
      const isOdd = parseInt(currentNumber[0]) % 2 !== 0;
      const isCorrect = (event.key === CONFIG.KEYS.ODD && isOdd) || 
                        (event.key === CONFIG.KEYS.EVEN && !isOdd);
      
      const trialData = {
        trialNumber: currentTrialIndex + 1,
        stimulus: currentNumber,
        response: event.key,
        correct: isCorrect,
        reactionTime: Date.now() - startTime,
        effortLevel: trialNumbers[currentTrialIndex].effortLevel
      };

      saveTrialData(db, trialData);
      setCurrentTrialIndex(prev => prev + 1);
    }
  }, [currentNumber, currentTrialIndex, db, startTime, trialNumbers]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  if (isExperimentComplete) {
    return <div className="task-complete">Experiment Complete</div>;
  }

  return (
    <div className="number-switching-task">
      <div className="number-display">{currentNumber}</div>
      <div className="instructions">
        Press '{CONFIG.KEYS.ODD}' for odd, '{CONFIG.KEYS.EVEN}' for even
      </div>
    </div>
  );
};

export default NumberSwitchingTask;