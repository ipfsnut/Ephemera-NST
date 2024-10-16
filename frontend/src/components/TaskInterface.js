import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchExperiment, updateExperiment } from '../redux/eventSlice';
import TrialDisplay from './TrialDisplay';
import ResultsDisplay from './ResultsDisplay';

const TaskInterface = () => {
  const dispatch = useDispatch();
  const { currentExperiment, status } = useSelector(state => state.event);
  const [currentTrialIndex, setCurrentTrialIndex] = useState(0);
  const [userResponses, setUserResponses] = useState([]);
  const [experimentState, setExperimentState] = useState('READY');

  useEffect(() => {
    dispatch(fetchExperiment('nst'));
  }, [dispatch]);

  useEffect(() => {
    if (currentExperiment && experimentState === 'READY') {
      setExperimentState('RUNNING');
    }
  }, [currentExperiment, experimentState]);

  const handleResponse = (response) => {
    if (experimentState === 'RUNNING') {
      const newResponse = {
        trialIndex: currentTrialIndex,
        response: response,
        timestamp: Date.now()
      };
      setUserResponses(prevResponses => [...prevResponses, newResponse]);
      
      if (currentTrialIndex < currentExperiment.trials.length - 1) {
        setCurrentTrialIndex(prevIndex => prevIndex + 1);
      } else {
        setExperimentState('COMPLETED');
        dispatch(updateExperiment({ 
          id: currentExperiment.id, 
          experimentData: { responses: [...userResponses, newResponse] }
        }));
      }
    }
  };

  if (status === 'loading') {
    return <div>Loading experiment...</div>;
  }

  if (!currentExperiment) {
    return <div>No experiment data available.</div>;
  }

  return (
    <div className="task-interface">
      {experimentState === 'RUNNING' && (
        <TrialDisplay
          currentTrial={currentExperiment.trials[currentTrialIndex]}
          onResponse={handleResponse}
        />
      )}
      {experimentState === 'COMPLETED' && (
        <ResultsDisplay results={userResponses} />
      )}
    </div>
  );
};

export default TaskInterface;