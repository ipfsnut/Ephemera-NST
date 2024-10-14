import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import NumberSwitchingTask from '../Experiments/NumberSwitchingTask/NumberSwitchingTask';

function ExperimentScreen({ experimentType }) {
  const [experiment, setExperiment] = useState(null);
  const config = useSelector(state => state.config);

  useEffect(() => {
    switch(experimentType) {
      case 'NumberSwitchingTask':
        setExperiment(<NumberSwitchingTask config={config} />);
        break;
      // Add cases for other experiment types here
      default:
        setExperiment(<div>Experiment not found</div>);
    }
  }, [experimentType, config]);

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center">
      {experiment}
    </div>
  );
}

export default ExperimentScreen;