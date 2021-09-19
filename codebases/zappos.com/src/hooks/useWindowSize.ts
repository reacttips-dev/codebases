import { useEffect, useState } from 'react';
import debounce from 'lodash.debounce';

interface WindowSize {
  width: number | undefined;
  height: number | undefined;
}

/**
 * Hook for observing the browser window dimensions with debounce
 * @param {number=500} wait The number of milliseconds to delay the debounce.
 * @returns {WindowSize} Object with window width and height
 */
const useWindowSize = (
  wait: number = 500
): WindowSize => {
  // Initial state is undefined
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: undefined,
    height: undefined
  });

  // Handler to call on window resize (with debounce to avoid unnecessary state updates)
  const handleResize = debounce(() => {
    setWindowSize({
      width: window?.innerWidth,
      height: window?.innerHeight
    });
  }, wait);

  useEffect(() => {
    // Add event listener
    window.addEventListener('resize', handleResize);

    // Call handler right away so state gets updated with initial window size without debounce
    setWindowSize({ width: window?.innerWidth, height: window?.innerHeight });

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);

    // Empty array ensures that effect is only run on mount
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return windowSize;
};

export default useWindowSize;
