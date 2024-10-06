export function generateMarkovNumber(prevNumber) {
  const transitionMatrix = {
    even: { even: 0.3, odd: 0.7 },
    odd: { even: 0.7, odd: 0.3 }
  };

  const prevType = prevNumber % 2 === 0 ? 'even' : 'odd';
  const rand = Math.random();
  const nextType = rand < transitionMatrix[prevType].even ? 'even' : 'odd';

  let nextNumber;
  do {
    nextNumber = Math.floor(Math.random() * 9) + 1; // Generate number between 1 and 9
  } while ((nextNumber % 2 === 0) !== (nextType === 'even'));

  return nextNumber;
}
