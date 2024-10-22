import React, { useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateConfig, selectCurrentConfig } from '../redux/configSlice';

const ConfigScreen = () => {
  const dispatch = useDispatch();
  const currentConfig = useSelector(selectCurrentConfig);
  const currentExperiment = useSelector(state => state.globalState.currentExperiment);

  const [numTrials, setNumTrials] = useState(currentConfig.numTrials || 1);
  const [difficultyLevel, setDifficultyLevel] = useState(currentConfig.difficultyLevel || 1);

  const handleNumTrialsChange = (e) => {
    const value = e.target.value;
    if (value === '' || parseInt(value) > 0) {
      setNumTrials(value);
    }
  };

  const handleSubmit = useCallback(() => {
    const experimentId = currentConfig.id || currentExperiment._id;
    if (experimentId) {
      const configData = {
        numTrials: parseInt(numTrials) || 1,
        difficultyLevel: parseInt(difficultyLevel) || 1
      };
      console.log('Updating config with:', configData);
      dispatch(updateConfig({
        id: experimentId,
        configData
      }));
    } else {
      console.error('No experiment ID available for config update');
    }
  }, [dispatch, currentConfig.id, currentExperiment._id, numTrials, difficultyLevel]);

  const difficultyOptions = useMemo(() =>
    Object.keys(currentConfig.DIFFICULTY_LEVELS || {}).map(level => (
      <option key={level} value={level}>
        Level {level} ({currentConfig.DIFFICULTY_LEVELS[level].min}-{currentConfig.DIFFICULTY_LEVELS[level].max} switches)
      </option>
    )),
    [currentConfig.DIFFICULTY_LEVELS]
  );

  return (
    <div className="config-screen">
      <h2>Configure Experiment</h2>
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <div className="input-group">
          <label htmlFor="numTrials">Number of Trials:</label>
          <input
            id="numTrials"
            type="number"
            value={numTrials}
            onChange={handleNumTrialsChange}
            min="1"
          />
        </div>
        <div className="input-group">
          <label htmlFor="difficultyLevel">Difficulty Level:</label>
          <select
            id="difficultyLevel"
            value={difficultyLevel}
            onChange={(e) => setDifficultyLevel(Number(e.target.value))}
          >
            {difficultyOptions}
          </select>
        </div>
        <div className="button-group">
          <button type="submit">Update Configuration</button>
        </div>
      </form>
    </div>
  );
};

export default React.memo(ConfigScreen);
