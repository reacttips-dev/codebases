import React, { useEffect } from 'react';
import { useOfflineState } from './useOfflineState';
import { TrelloOnline } from 'app/src/components/TrelloOnline';
import {
  PreloadStatus,
  useRoutePreloader,
} from 'app/src/components/RoutePreloader';
import { featureFlagClient } from '@trello/feature-flag-client';
import { Analytics } from '@trello/atlassian-analytics';

const cachedFlagValues: {
  [key: string]: boolean;
} = {};
function cachedFlagValue(key: string, defaultValue: boolean) {
  if (cachedFlagValues[key] === undefined) {
    cachedFlagValues[key] = featureFlagClient.get(key, defaultValue);
  }
  return cachedFlagValues[key];
}

export const App = () => {
  const wasEverOffline = useOfflineState();

  if (wasEverOffline) {
    window.location.href = `/offline?returnUrl=${encodeURIComponent(
      window.location.pathname,
    )}`;
  }

  const isBoardRoutePreloadingEnabled = cachedFlagValue(
    'fep.board_route_preloading',
    false,
  );

  const isCardRoutePreloadingEnabled = cachedFlagValue(
    'fep.card_route_preloading',
    false,
  );

  const isMemberHomeRoutePreloadingEnabled = cachedFlagValue(
    'fep.member_home_route_preloading',
    false,
  );

  const { preloadStatus } = useRoutePreloader({
    isBoardRoutePreloadingEnabled,
    isCardRoutePreloadingEnabled,
    isMemberHomeRoutePreloadingEnabled,
  });

  useEffect(() => {
    if (preloadStatus !== PreloadStatus.PRELOADING) {
      Analytics.sendOperationalEvent({
        action: 'finished',
        actionSubject: 'fetchRouteData',
        source: 'appStartup',
        attributes: {
          reason: preloadStatus,
        },
      });
    }
  }, [preloadStatus]);

  return preloadStatus === PreloadStatus.PRELOADING ? null : <TrelloOnline />;
};
