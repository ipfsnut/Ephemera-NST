import React from 'react';
import { CONFIG } from '../../config/numberSwitchingConfig';

const TrialDisplay = ({ currentDigit, currentTrialIndex, totalTrials, experimentState }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      {experimentState === 'SHOWING_DIGIT' || experimentState === 'AWAITING_RESPONSE' ? (
        <>
          <div className="digit-display text-6xl font-bold mb-4">{currentDigit}</div>
          <p className="text-xl mb-2">
            Press '{CONFIG.KEYS.ODD}' for odd numbers, '{CONFIG.KEYS.EVEN}' for even numbers
          </p>
        </>
      ) : (
        <div>Preparing next trial...</div>
      )}
      <p className="text-lg">
        Trial: {currentTrialIndex + 1} / {totalTrials}
      </p>
    </div>
  );
};

export default TrialDisplay;
