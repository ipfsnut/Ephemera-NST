import React from 'react';
import { useDispatch } from 'react-redux';
import { fetchEvent } from '../redux/eventSlice';

const ExperimentList = () => {
  const dispatch = useDispatch();

  const handleStartExperiment = (eventId) => {
    dispatch(fetchEvent(eventId));
  };

  return (
    <div className="experiment-list">
      <h2>Available Experiments</h2>
      <ul>
        <li>
          <h3 className="experiment-title">Number Switching Task</h3>
          <div className="button-group">
            <button onClick={() => handleStartExperiment('aboutNST')}>
              About
            </button>
            <button onClick={() => handleStartExperiment('config')}>
              Custom Experiment
            </button>
            <button onClick={() => handleStartExperiment('nst')}>
              Standard Experiment
            </button>
          </div>
        </li>
        {/* Add more experiment options here as needed */}
      </ul>
    </div>
  );
};

export default ExperimentList;