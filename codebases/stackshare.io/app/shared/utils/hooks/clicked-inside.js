import {useEffect} from 'react';

/**
 * Hook that alerts clicks inside of the passed ref
 */
function useClickedInside(ref, funcToCallWhenClickedInside, dependencyArray = []) {
  useEffect(() => {
    function handleClickInside(event) {
      if (ref.current && ref.current.contains(event.target)) {
        funcToCallWhenClickedInside();
      }
    }
    // Bind the event listener
    document.addEventListener('mousedown', handleClickInside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickInside);
    };
  }, [ref, ...dependencyArray]);
}

export default useClickedInside;
