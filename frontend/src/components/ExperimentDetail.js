import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchExperiment } from '../redux/experimentSlice';

const ExperimentDetail = ({ id }) => {
  const dispatch = useDispatch();
  const { experiment, status, error } = useSelector(state => state.experiment);

  useEffect(() => {
    dispatch(fetchExperiment(id));
  }, [dispatch, id]);

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'failed') return <div>Error: {error}</div>;
  if (!experiment) return null;

  return (
    <div>
      <h2>{experiment.name}</h2>
      {/* Render other experiment details */}
    </div>
  );
};

export default ExperimentDetail;
