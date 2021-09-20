import isEqual from 'react-fast-compare';
import { useEffect } from 'react';

import { useSharedState } from '@trello/shared-state';

import { locationState } from './locationState';

export function useLocationStateUpdater(): void {
  const [location, setLocation] = useSharedState(locationState);

  useEffect(() => {
    function handleHistoryChange() {
      const { pathname, search, hash } = window.location;
      const nextLocation = { pathname, search, hash };

      if (isEqual(location, nextLocation)) {
        return;
      }

      setLocation(nextLocation);
    }

    window.addEventListener('pushstate', handleHistoryChange);
    window.addEventListener('replacestate', handleHistoryChange);
    window.addEventListener('popstate', handleHistoryChange);

    return () => {
      window.removeEventListener('pushstate', handleHistoryChange);
      window.removeEventListener('replacestate', handleHistoryChange);
      window.removeEventListener('popstate', handleHistoryChange);
    };
  }, [location, setLocation]);
}
