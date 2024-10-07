import React, { useState } from 'react';
import NumberSwitchingTask from '../Experiments/NumberSwitchingTask';

const ExperimentList = () => {
  const [selectedExperiment, setSelectedExperiment] = useState(null);

  const experiments = [
    {
      name: 'Number Switching Task',
      description: 'A cognitive task that measures your ability to switch between different number-related rules.',
      component: NumberSwitchingTask
    },
    // Add more experiments here as they are developed
  ];

  const handleExperimentSelect = (experiment) => {
    setSelectedExperiment(experiment);
  };

  return (
    <div>
      <h2>Available Experiments</h2>
      {!selectedExperiment ? (
        <ul>
          {experiments.map((experiment, index) => (
            <li key={index}>
              <h3>{experiment.name}</h3>
              <p>{experiment.description}</p>
              <button onClick={() => handleExperimentSelect(experiment)}>Select Experiment</button>
            </li>
          ))}
        </ul>
      ) : (
        <div>
          <h2>{selectedExperiment.name}</h2>
          <p>{selectedExperiment.description}</p>
          <selectedExperiment.component />
          <button onClick={() => setSelectedExperiment(null)}>Back to Experiment List</button>
        </div>
      )}
    </div>
  );
};

export default ExperimentList;
