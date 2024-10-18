import React from 'react';
import { useSelector } from 'react-redux';

const TrialDisplay = ({ currentDigit, currentTrialIndex, totalTrials, experimentState }) => {
  if (experimentState === 'SHOWING_DIGIT' || experimentState === 'AWAITING_RESPONSE') {
    return (
      <div>
        <h2>Current Digit: {currentDigit}</h2>
        <p>Trial {currentTrialIndex + 1} of {totalTrials}</p>
      </div>
    );
  }
  return null;
};
export default TrialDisplay;