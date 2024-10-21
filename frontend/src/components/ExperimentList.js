import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExperiments } from '../redux/eventSlice';
import { setCurrentView, setCurrentExperiment } from '../redux/globalState';

const ExperimentList = () => {
  const dispatch = useDispatch();
  const { experiments, status, error } = useSelector(state => state.event);

  useEffect(() => {
    dispatch(fetchExperiments());
  }, [dispatch]);

  const handleStartExperiment = (experiment) => {
    console.log('Starting experiment:', experiment);
    dispatch(setCurrentExperiment(experiment));
    dispatch(setCurrentView('EXPERIMENT'));
  };

  const handleAboutClick = (experiment) => {
    dispatch(setCurrentExperiment(experiment));
    dispatch(setCurrentView('ABOUT'));
  };

  if (status === 'loading') return <div>Loading experiments...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Available Experiments</h2>
      <ul>
        {experiments.map(experiment => (
          <li key={experiment._id}>
            {experiment.name}
            <button onClick={() => handleAboutClick(experiment)}>About</button>
            <button onClick={() => {
  dispatch(setCurrentExperiment(experiment));
  dispatch(setCurrentView('CONFIG'));
}}>Config</button>
            <button onClick={() => handleStartExperiment(experiment)}>Start Experiment</button>
          </li>
        ))}
      </ul>
    </div>
  );
};export default ExperimentList;