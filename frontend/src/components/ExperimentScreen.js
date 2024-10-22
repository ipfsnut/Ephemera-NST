import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectCurrentConfig, 
  resetExperimentState, 
  setTotalTrials, 
  selectCurrentTrial, 
  selectTotalTrials 
} from '../redux/configSlice';
import NumberSwitchingTask from '../Experiments/NumberSwitchingTask/NumberSwitchingTask';

const ExperimentScreen = ({ experiment }) => {
  const dispatch = useDispatch();
  const config = useSelector(selectCurrentConfig);
  const currentTrial = useSelector(selectCurrentTrial);
  const totalTrials = useSelector(selectTotalTrials);

  useEffect(() => {
    console.log('ExperimentScreen: Experiment prop:', experiment);
    const numTrials = experiment.configuration.numTrials;
    console.log('ExperimentScreen: Experiment numTrials:', numTrials);
    dispatch(resetExperimentState());
    dispatch(setTotalTrials(numTrials));
  }, [config, dispatch, experiment]);

  useEffect(() => {
    console.log('ExperimentScreen: Updated totalTrials:', totalTrials);
  }, [totalTrials]);

  return (
    <div>
      <h2>{experiment.name}</h2>
      <div>Progress: Trial {currentTrial + 1} of {totalTrials}</div>
      <NumberSwitchingTask experiment={experiment} />
    </div>
  );
};
export default ExperimentScreen;