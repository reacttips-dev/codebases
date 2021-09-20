import { useState, useEffect } from 'react';

/**
 * util to get current window dimensions
 * @returns
 */
function getWindowDimensions () {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

/**
 * React hook to get current window dimensions
 * @returns
 */
export default function useWindowDimensions () {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions(getWindowDimensions());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}
