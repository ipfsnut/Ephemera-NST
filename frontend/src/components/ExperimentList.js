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
          <button onClick={() => handleStartExperiment('nst')}>
            Start Number Switching Task
          </button>
        </li>
        {/* Add more experiment options here as needed */}
      </ul>
    </div>
  );
};

export default ExperimentList;