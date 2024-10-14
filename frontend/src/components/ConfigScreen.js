import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateConfig } from '../redux/configSlice';
import { CONFIG } from '../config/numberSwitchingConfig';

const ConfigScreen = () => {
  const dispatch = useDispatch();
  const currentConfig = useSelector(state => state.config);
  const [numTrials, setNumTrials] = useState(currentConfig.numTrials || 14);
  const [difficultyLevel, setDifficultyLevel] = useState(currentConfig.difficultyLevel || '1');

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    dispatch(updateConfig({ 
      numTrials: parseInt(numTrials, 10), 
      difficultyLevel, 
      isCustom: true 
    }));
  };

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
            {Object.keys(CONFIG.DIFFICULTY_LEVELS).map(level => (
              <option key={level} value={level}>
                Level {level} ({CONFIG.DIFFICULTY_LEVELS[level].min}-{CONFIG.DIFFICULTY_LEVELS[level].max} switches)
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

export default ConfigScreen;