import React, { useState, useEffect } from 'react';
import { getAllTrialData } from '../utils/indexedDB';
import '../styles/ResultsDisplay.css';

function ResultsDisplay({ db, onExport }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    getAllTrialData(db).then(setResults).catch(console.error);
  }, [db]);

  return (
    <div className="results-view">
      <h2>Experiment Results</h2>
      <div className="results-summary">
        <p>Total Trials: {results.length}</p>
        <p>Correct Trials: {results.filter(trial => trial.allCorrect).length}</p>
      </div>
      <div className="results-list">
        {results.map(trial => (
          <div key={trial.trialNumber} className="trial-result">
            <h3>Trial {trial.trialNumber}</h3>
            <p>Correct: {trial.allCorrect ? 'Yes' : 'No'}</p>
            <p>Responses: {trial.responses.filter(r => r.correct).length} / {trial.responses.length}</p>
            {trial.imageData && <img src={trial.imageData} alt={`Trial ${trial.trialNumber}`} />}
          </div>
        ))}
      </div>
      <button onClick={onExport} className="export-button">Export Data</button>
    </div>
  );
}

export default ResultsDisplay;