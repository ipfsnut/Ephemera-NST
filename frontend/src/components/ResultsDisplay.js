import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = window.REACT_APP_API_BASE_URL || 'http://localhost:5069/api';



const ResultsDisplay = ({ experimentId }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState(null);

  const downloadResults = async () => {
    setIsExporting(true);
    setExportError(null);

    try {
      const response = await axios.get(`${API_BASE_URL}/api/experiments/${experimentId}/export`, {
        responseType: 'blob',
        withCredentials: true
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `experiment_${experimentId}_results.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading results:', error);
      setExportError('Failed to download results. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="results-container">
      <h2>Experiment Results</h2>
      <button 
        className="export-button"
        onClick={downloadResults}
        disabled={isExporting}
      >
        {isExporting ? 'Exporting...' : 'Export Data'}
      </button>
      {exportError && <p className="error-message">{exportError}</p>}
    </div>
  );
};

export default ResultsDisplay;