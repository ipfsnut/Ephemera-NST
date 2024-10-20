import React from 'react';
import { useSelector } from 'react-redux';

const ResultsView = () => {
  const responses = useSelector(state => state.event.responses);

  const calculateAverageResponseTime = () => {
    if (responses.length === 0) return 0;
    const totalTime = responses.reduce((sum, response) => sum + response.responseTime, 0);
    return totalTime / responses.length;
  };

  const calculateAccuracy = () => {
    if (responses.length === 0) return 0;
    const correctResponses = responses.filter(response => 
      (response.digit % 2 === 0 && response.response === 'j') || 
      (response.digit % 2 !== 0 && response.response === 'f')
    );
    return (correctResponses.length / responses.length) * 100;
  };

  return (
    <div className="results-view">
      <h2>Number Switching Task Results</h2>
      <p>Total Trials: {responses.length}</p>
      <p>Average Response Time: {calculateAverageResponseTime().toFixed(2)} ms</p>
      <p>Accuracy: {calculateAccuracy().toFixed(2)}%</p>
      <h3>Response Details:</h3>
      <ul>
        {responses.map((response, index) => (
          <li key={index}>
            Digit: {response.digit}, 
            Response: {response.response}, 
            Time: {response.responseTime} ms
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResultsView;