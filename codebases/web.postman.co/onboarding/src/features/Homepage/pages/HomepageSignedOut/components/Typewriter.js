import React, { useState, useRef, useEffect, Fragment } from 'react';
import styled from 'styled-components';

const StyledTypeSymbol = styled.span`
  animation: blinker 1s step-start infinite;
`;

const Typewriter = ({ labels }) => {
  const [displayStr, setDisplayStr] = useState(null);
  const [isAnimating, setIsAnimating] = useState(true);

  const intervalRef = useRef(null);

  const state = useRef({
    counter: 1, // -> represents character limit to display
    direction: '+', // + -> forward direction, - -> backward direction
    index: 0, // -> represents which label to display
    thresholdLimit: 6, // represents number * forwardDelay i.e time the word stays after one sequence is complete
    currentThreshold: 0, // represents current value of threshold
    forwardDelay: 220, // represents delay while printing characters in forward direction
    backwardDelay: 50, // represents delay while printing characters in backward direction
    isLoopComplete: false
  });

  const setState = (newState) => { state.current = { ...state.current, ...newState }; };

  const createInterval = (cb, delay) => {
    // Clear existing interval if any
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => { cb(); }, delay);
  };

  const updateRender = () => {
    let { direction, counter, index } = state.current;
    direction === '+' ? counter++ : counter--;
    setState({ counter });
    setDisplayStr(labels[index].substring(0, counter));

  };

  /**
   * This function creates the typewriter effect, which is that it prints 1 character at a time at a specific interval,
   * and stays there for certain time and then deletes the word and displays a new one in the same fashion.
   */
  const init = () => {
    let { direction, forwardDelay, backwardDelay } = state.current;

    setDisplayStr(labels[state.current.index].substring(0, state.current.counter));
    createInterval(() => {
      let { counter, direction, index, thresholdLimit, currentThreshold, isLoopComplete } = state.current;

      if (isLoopComplete && index === 0 && counter === labels[0].length) {
        // Loop for first sequence is complete, thereby close the loop
        clearInterval(intervalRef.current);
        setIsAnimating(false);
        return;
      }

      if (counter === labels[index].length) {
        if (currentThreshold < thresholdLimit - 1) {
          setState({ currentThreshold: ((currentThreshold + 1) % thresholdLimit) });
          return;
        }

        if (index === labels.length - 1) {
          setState({ isLoopComplete: true });
        }

        setState({ direction: '-', currentThreshold: 0 });
        updateRender();
        return init();
      } else if (counter === 0 && direction === '-') {
        setState({ direction: '+', index: (index + 1) % labels.length });
        updateRender();
        return init();
      }

      updateRender();

    }, direction === '+' ? forwardDelay : backwardDelay);
  };

  useEffect(() => {
    init();
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <Fragment>
      {displayStr} {isAnimating && <StyledTypeSymbol>_</StyledTypeSymbol> }
    </Fragment>
  );
};

export default Typewriter;
