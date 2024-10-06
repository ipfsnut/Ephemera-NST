import React, { useState, useEffect, useCallback } from 'react';
import { generateMarkovNumber } from '../utils/markovChain';
import { numberSwitchingConfig as config } from '../config/numberSwitchingConfig';
import { initDB, saveTrialData } from '../utils/indexedDB';import './NumberSwitchingTask.css';

const NumberSwitchingTask = () => {
  const [currentNumber, setCurrentNumber] = useState(null);
  const [trialCount, setTrialCount] = useState(0);
  const [db, setDB] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);


  useEffect(() => {
    initDB().then(setDB);
  }, []);

  const [startTime, setStartTime] = useState(null);
  useEffect(() => {
    if (trialCount < config.totalTrials) {
      const nextNumber = generateMarkovNumber(currentNumber);
      setCurrentNumber(nextNumber);
      setStartTime(Date.now());
    }
  }, [trialCount, currentNumber]);
  const handleKeyPress = useCallback((event) => {
    if (!isProcessing && (event.key === config.keyMappings.odd || event.key === config.keyMappings.even) && currentNumber !== null) {
      setIsProcessing(true);
      
      const isCorrect = (event.key === config.keyMappings.odd && currentNumber % 2 !== 0) || 
                        (event.key === config.keyMappings.even && currentNumber % 2 === 0);
      
      const trialData = {
        trialNumber: trialCount + 1,
        stimulus: currentNumber,
        response: event.key,
        correct: isCorrect,
        reactionTime: Date.now() - startTime
      };

      saveTrialData(db, trialData);
      setTrialCount(prev => prev + 1);
      
      if (trialCount < config.totalTrials - 1) {
        setTimeout(() => {
          setCurrentNumber(generateMarkovNumber(currentNumber, config.markovTransitionProbabilities));
          setIsProcessing(false);
        }, config.interTrialInterval);
      } else {
        setCurrentNumber(null);
        setIsProcessing(false);
      }
    }
  }, [currentNumber, trialCount, db, startTime, isProcessing]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  useEffect(() => {
    if (trialCount === 0) {
      setCurrentNumber(generateMarkovNumber(5, config.markovTransitionProbabilities));
    }
  }, [trialCount]);

  if (currentNumber === null && trialCount >= config.totalTrials) {
    return <div className="task-complete">Task Complete</div>;
  }

  return (
    <div className="number-switching-task">
      <div className="number-display">{currentNumber}</div>
      <div className="instructions">
        Press '{config.keyMappings.odd}' for odd, '{config.keyMappings.even}' for even
      </div>
    </div>
  );
};

export default NumberSwitchingTask;
