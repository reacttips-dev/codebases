import { useEffect, useState } from 'react';
import { featureFlagClient } from '@trello/feature-flag-client';

export const useOfflineState = () => {
  const defaultOfflineState = featureFlagClient.get(
    'fep.take_trello_offline',
    false,
  );
  const [isOffline, setIsOffline] = useState(defaultOfflineState as boolean);

  useEffect(() => {
    const onFlagChanged = (newValue: boolean) => {
      // This value can only ever switch states to true.
      if (newValue === true) {
        setIsOffline(newValue);
      }
      featureFlagClient.off('fep.take_trello_offline', onFlagChanged);
    };
    featureFlagClient.on(
      'fep.take_trello_offline',
      defaultOfflineState,
      onFlagChanged,
    );

    return () =>
      featureFlagClient.off('fep.take_trello_offline', onFlagChanged);
  }, [defaultOfflineState, isOffline]);

  return isOffline;
};
