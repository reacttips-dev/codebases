import { useEffect, useRef } from 'react';

// Returns the previous version of a value, updated each time that value changes
// Do note that this is a shallow equality comparison, so passing an object or an array that is not
// stabilized with useMemo will result in the "previous" value changing every render

// usage looks like:  const previousValue = usePrevious(value)
const usePrevious = <T>(value: T) => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

export default usePrevious;
