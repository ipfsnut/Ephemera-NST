import React, { useEffect, useState } from 'react';
import { getAllTrialData } from '../utils/indexedDB';

const ResultsDisplay = ({ db }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (db) {
      getAllTrialData(db)
        .then(data => {
          setResults(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching results:', error);
          setLoading(false);
        });
    }
  }, [db]);

  if (loading) {
    return <div>Loading results...</div>;
  }

  // Render your results here
  return (
    <div>
      <h2>Experiment Results</h2>
      {/* Display your results data here */}
    </div>
  );
};

export default ResultsDisplay;
