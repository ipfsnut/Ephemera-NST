import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExperiments } from '../redux/eventSlice';

const ExperimentList = () => {
  const dispatch = useDispatch();
  const { experiments, status, error } = useSelector(state => state.event);

  useEffect(() => {
    dispatch(fetchExperiments());
  }, [dispatch]);

  if (status === 'loading') return <div>Loading experiments...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Available Experiments</h2>
      <ul>
        {experiments.map(experiment => (
          <li key={experiment.id}>{experiment.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ExperimentList;