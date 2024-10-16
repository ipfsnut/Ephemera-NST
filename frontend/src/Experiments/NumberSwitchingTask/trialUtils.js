export const processTrialResponse = (currentDigit, response, keys) => {
  const isOdd = parseInt(currentDigit) % 2 !== 0;
  const isCorrect = (response === keys.ODD && isOdd) || (response === keys.EVEN && !isOdd);
  
  return {
    digit: currentDigit,
    response: response,
    correct: isCorrect,
    responseTime: performance.now()
  };
};

