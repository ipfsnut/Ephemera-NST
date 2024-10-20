import React from 'react';
import { useSelector } from 'react-redux';
import NumberSwitchingTask from '../Experiments/NumberSwitchingTask/NumberSwitchingTask';

function ExperimentScreen({ experiment }) {
  console.log('ExperimentScreen props:', { experiment });

  const renderExperiment = () => {
    if (experiment && experiment.name === 'Number Switching Task') {
      console.log('Rendering NumberSwitchingTask');
      return <NumberSwitchingTask experiment={experiment} />;
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