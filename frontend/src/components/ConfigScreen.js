import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateConfig } from '../redux/configSlice';

const ConfigScreen = () => {
  const dispatch = useDispatch();
  const config = useSelector(state => state.config) || {};
  const [numTrials, setNumTrials] = useState(config.numTrials || 10);
  const [difficultyLevel, setDifficultyLevel] = useState(config.difficultyLevels?.[0] || 'easy');

  const handleCustomSubmit = useCallback((e) => {
    e.preventDefault();
    dispatch(updateConfig({
      numTrials: parseInt(numTrials, 10),
      difficultyLevel,
      isCustom: true
    }));
    dispatch(setCurrentView('EXPERIMENT_LIST')); // or 'EXPERIMENT' if you want to start immediately
  }, [dispatch, numTrials, difficultyLevel]);

  const handleNumTrialsChange = (e) => {
    const value = e.target.value;
    setNumTrials(value === '' ? '' : parseInt(value, 10));
  };

  return (
    <div className="config-screen">
      <h2>Configure Experiment</h2>
      <form onSubmit={handleCustomSubmit}>
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
            onChange={(e) => setDifficultyLevel(e.target.value)}
          >
            <option value="all">All Levels (Random)</option>
            {Object.keys(config.DIFFICULTY_LEVELS || {}).map(level => (
              <option key={level} value={level}>
                Level {level} ({config.DIFFICULTY_LEVELS[level].min}-{config.DIFFICULTY_LEVELS[level].max} switches)
              </option>
            ))}
          </select>
        </div>
        <div className="button-group">
          <button type="submit">Confirm Custom Configuration</button>
        </div>
      </form>
    </div>
  );
};

export default React.memo(ConfigScreen);