import {useEffect} from 'react';

/**
 * Hook that alerts clicks outside of the passed ref
 */
function useClickedOutside(ref, funcToCallWhenClickedOutside, dependencyArray) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        funcToCallWhenClickedOutside();
      }
    }
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, ...dependencyArray]);
}

export default useClickedOutside;
