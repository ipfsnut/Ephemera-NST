



## Markov Chain Number Generator
The markovChain.js file is a sophisticated number generator designed specifically for the Number Switching Task experiment. Here's a detailed explanation of its functionality:

The file exports two main functions: generateMarkovNumber and generateTrialNumbers.

generateMarkovNumber creates a single trial number based on a given effort level. It uses the CONFIG object to determine the minimum and maximum number of switches for that effort level. It then generates a string of digits, alternating between odd and even numbers based on a calculated switch probability. This ensures that the number of switches in the generated number falls within the specified range for the given effort level.

generateTrialNumbers creates a full set of trial numbers for the experiment. It distributes effort levels evenly across all trials, generates a number for each trial using generateMarkovNumber, and then shuffles the order of the trials to prevent predictability.

The Markov chain aspect comes into play in how each digit influences the probability of the next digit. The isOdd boolean acts as the "state" in the Markov chain, determining whether the next digit will be odd or even.

The randomness in this system comes from several sources:

The initial odd/even state is randomly chosen.
The exact number of switches within the min-max range is randomly determined.
The specific digit within the odd or even category is randomly selected.
The final order of trials is randomly shuffled.
Users can be confident in the randomness of the generated numbers because:

Multiple layers of randomization are employed.
The system uses JavaScript's built-in Math.random() function, which provides a high-quality source of randomness.
The algorithm ensures a balance between randomness and controlled difficulty progression through the effort levels.
While not cryptographically secure, this method provides more than sufficient randomness for the purposes of a psychological experiment, ensuring unpredictability for participants while maintaining experimental control.




## Performance Optimization
The process to make the task more responsive involves several key steps:

Optimize state management by using useRef for values that don't need to trigger re-renders.
Streamline the key press handler to reduce unnecessary computations.
Implement a debounce mechanism to prevent accidental double inputs.
Ensure that state updates are batched efficiently to minimize render cycles.
Refactor the showNextDigit function to be more performant.
This approach will significantly improve the responsiveness of the experiment, ensuring that each key press is registered accurately and promptly. The result will be a smoother, more fluid user experience where participants can progress through the task without any perceived lag or need for repeated inputs.