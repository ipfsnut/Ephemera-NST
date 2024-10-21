import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentConfig } from '../redux/configSlice';
import { resetExperimentState } from '../redux/configSlice';
import NumberSwitchingTask from '../Experiments/NumberSwitchingTask/NumberSwitchingTask';

const ExperimentScreen = ({ experiment }) => {
  const dispatch = useDispatch();
  const config = useSelector(selectCurrentConfig);

  useEffect(() => {
    dispatch(resetExperimentState());
  }, [config, dispatch]);

  return (
    <div>
      <h2>{experiment.name}</h2>
      <NumberSwitchingTask experiment={experiment} />
    </div>
  );
};

export default ExperimentScreen;