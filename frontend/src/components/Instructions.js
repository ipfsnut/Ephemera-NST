import React from 'react';

const Instructions = () => {
  return (
    <div className="instructions">
      <h2>Instructions</h2>
      <p>
        In this task, you will be presented with numbers. Your goal is to categorize them based on specific rules.
        The rules will switch between:
        1. Odd/Even
        2. Less than/Greater than 5
        Pay attention to the current rule displayed on the screen.
      </p>
    </div>
  );
};

export default Instructions;