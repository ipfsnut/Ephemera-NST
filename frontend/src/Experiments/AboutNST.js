import React from 'react';
import ReactMarkdown from 'react-markdown';
import './AboutNST.css';

const AboutNSTContent = `
# About the Number Switching Task

## Overview
The Number Switching Task is a cognitive experiment designed to measure participants' ability to switch between different mental sets rapidly. It assesses cognitive flexibility, a crucial component of executive function.

## Task Structure
- Each trial consists of a 15-digit number.
- Digits are presented one at a time to the participant.
- Participants must categorize each digit as odd or even.
- Responses are made using keyboard inputs: 'f' for odd and 'j' for even.

## Difficulty Levels
The task incorporates seven difficulty levels, ranging from 1 to 7. These levels determine the number of "switches" within each 15-digit sequence:

1. 1-2 switches
2. 3-4 switches
3. 5-6 switches
4. 7-8 switches
5. 9-10 switches
6. 11-12 switches
7. 13-14 switches

A "switch" occurs when the categorization changes from odd to even or vice versa.

## Number Generation
Numbers are generated using a Markov chain-based algorithm, ensuring a controlled distribution of switches based on the difficulty level.

## Data Collection
For each digit presentation, the system records:
- The presented digit
- The participant's response
- Response accuracy
- Reaction time

## Purpose
This task aims to:
1. Measure cognitive flexibility
2. Assess the speed and accuracy of mental set switching
3. Evaluate how increasing task difficulty affects performance

## Importance
Understanding cognitive flexibility is crucial in various fields, including psychology, neuroscience, and clinical assessments. This task provides valuable insights into an individual's ability to adapt to changing task demands, a skill essential in many real-world scenarios.
`

const AboutNST = () => {
  return (
    <div className="about-nst">
      <ReactMarkdown>{AboutNSTContent}</ReactMarkdown>
    </div>
  )
}

export default AboutNST