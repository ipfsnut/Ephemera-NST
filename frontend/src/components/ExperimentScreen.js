import React, { useState, useEffect } from 'react';
import NumberSwitchingTask from '../Experiments/NumberSwitchingTask';

function ExperimentScreen({ experimentType }) {
  const [experiment, setExperiment] = useState(null);

  useEffect(() => {
    switch(experimentType) {
      case 'NumberSwitchingTask':
        setExperiment(<NumberSwitchingTask />);
        break;
      // Add cases for other experiment types here
      default:
        setExperiment(<div>Experiment not found</div>);
    }
  }, [experimentType]);

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center">
      {experiment}
    </div>
  );
}

export default ExperimentScreen;
