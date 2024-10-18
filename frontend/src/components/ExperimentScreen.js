import React from 'react';
import { useSelector } from 'react-redux';
import NumberSwitchingTask from '../Experiments/NumberSwitchingTask/NumberSwitchingTask';

function ExperimentScreen({ experimentType, currentDigit, currentTrialIndex, totalTrials, experimentState }) {
  console.log('ExperimentScreen props:', { experimentType, currentDigit, currentTrialIndex, totalTrials, experimentState });
  const config = useSelector(state => state.config);
  const currentEvent = useSelector(state => state.event.currentEvent);

  const renderExperiment = () => {
    if (currentEvent && currentEvent.nst === 'NumberSwitchingTask') {
      console.log('Rendering NumberSwitchingTask');
      return (
        <NumberSwitchingTask
          config={config}
          currentDigit={currentDigit}
          currentTrialIndex={currentTrialIndex}
          totalTrials={totalTrials}
          experimentState={experimentState}
        />
      );
    }
    console.log('Experiment not found');
    return <div>Experiment not found</div>;
  };

  const experimentComponent = renderExperiment();
  console.log('Experiment component:', experimentComponent);

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center">
      {experimentComponent}
    </div>
  );
}

export default ExperimentScreen;