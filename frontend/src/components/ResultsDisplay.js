import React from 'react';

const ResultsDisplay = ({ results, downloadResults }) => {
  return (
    <div className="results-container">
      <h2>Experiment Results</h2>
      <pre>{JSON.stringify(results, null, 2)}</pre>
      {downloadResults && (
        <button 
          className="export-button"
          onClick={downloadResults}
        >
          Export Data
        </button>
      )}
    </div>
  );
};

export default ResultsDisplay;