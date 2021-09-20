import { useRef, useEffect } from 'react';

export function usePreviousWhileFalsey<T>(
  value: T,
  isLoading: boolean,
  initialValue: T,
): T {
  const previousValue = useRef<T>(initialValue);

  useEffect(() => {
    if (isLoading || !value) {
      return;
    }

    previousValue.current = value;
  }, [value, isLoading]);

  return isLoading || !value ? previousValue.current : value;
}
