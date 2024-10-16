import React, { useState, useEffect } from 'react';
import { getAllTrialData } from '../../utils/indexedDB';

function ResultsView({ db, onExport }) {
  const [results, setResults] = useState({});

  useEffect(() => {
    getAllTrialData(db).then(setResults).catch(console.error);
  }, [db]);

  const trialEntries = Object.entries(results);
  const totalTrials = trialEntries.length;
  const correctTrials = trialEntries.filter(([_, responses]) => 
    responses.every(response => response.correct)
  ).length;

  return (
    <div className="results-view">
      <h2>Experiment Results</h2>
      <div className="results-summary">
        <p>Total Trials: {totalTrials}</p>
        <p>Correct Trials: {correctTrials}</p>
      </div>
      <div className="results-list">
        {trialEntries.map(([trialIndex, responses]) => (
          <div key={trialIndex} className="trial-result">
            <h3>Trial {trialIndex}</h3>
            <p>Correct: {responses.every(r => r.correct) ? 'Yes' : 'No'}</p>
            <p>Responses: {responses.filter(r => r.correct).length} / {responses.length}</p>
          </div>
        ))}
      </div>
      <button onClick={onExport} className="export-button">Export Data</button>
    </div>
  );
}

export default ResultsView;
