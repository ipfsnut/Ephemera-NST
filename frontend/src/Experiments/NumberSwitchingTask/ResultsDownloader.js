import React, { useEffect, useCallback } from 'react';
import { getAllTrialData } from '../../utils/indexedDB';

const ResultsDownloader = ({ experimentState, db, setDownloadFunction }) => {
  const downloadResults = useCallback(async () => {
    if (db) {
      const allTrialData = await getAllTrialData(db);
      const resultsBlob = new Blob([JSON.stringify(allTrialData, null, 2)], {type: 'application/json'});
      const url = URL.createObjectURL(resultsBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'experiment_results.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }, [db]);

  useEffect(() => {
    setDownloadFunction(() => downloadResults);
  }, [downloadResults, setDownloadFunction]);

  return null;
};

export default ResultsDownloader;