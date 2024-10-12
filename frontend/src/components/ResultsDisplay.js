import React, { useState, useEffect } from 'react';
import { getAllTrialData } from '../utils/indexedDB';

function ResultsDisplay({ db, onExport }) {
  const [trialData, setTrialData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllTrialData(db);
      setTrialData(data);
    };
    fetchData();
  }, [db]);

  const calculateAccuracy = (responses) => {
    const correctResponses = responses.filter(r => r.correct).length;
    return (correctResponses / responses.length) * 100;
  };

  return (
    <div className="results-display">
      <h2>Experiment Results</h2>
      {trialData.map((trial, index) => (
        <div key={index} className="trial-result">
          <h3>Trial {trial.trialNumber}</h3>
          <p>Effort Level: {trial.effortLevel}</p>
          <p>Accuracy: {calculateAccuracy(trial.responses).toFixed(2)}%</p>
          <p>All Correct: {trial.allCorrect ? 'Yes' : 'No'}</p>
        </div>
      ))}
      <button onClick={onExport}>Export Data</button>
    </div>
  );
}

export default ResultsDisplay;
