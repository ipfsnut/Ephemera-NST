import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ResultsView({ experimentId }) {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(`/api/experiments/${experimentId}/results`);
        setResults(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch results');
        setLoading(false);
      }
    };

    fetchResults();
  }, [experimentId]);

  const handleExport = async () => {
    try {
      const response = await axios.get(`/api/experiments/${experimentId}/export`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'experiment_results.csv');
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error('Failed to export results', err);
    }
  };

  if (loading) return <div>Loading results...</div>;
  if (error) return <div>{error}</div>;
  if (!results) return <div>No results available</div>;

  return (
    <div className="results-view">
      <h2>Experiment Results</h2>
      <div className="results-summary">
        <p>Total Trials: {results.totalTrials}</p>
        <p>Correct Trials: {results.correctTrials}</p>
      </div>
      <div className="results-list">
        {results.trials.map((trial, index) => (
          <div key={index} className="trial-result">
            <h3>Trial {index + 1}</h3>
            <p>Correct: {trial.correct ? 'Yes' : 'No'}</p>
            <p>Response Time: {trial.responseTime}ms</p>
          </div>
        ))}
      </div>
      <button onClick={handleExport} className="export-button">Export Data</button>
    </div>
  );
}

export default ResultsView;
