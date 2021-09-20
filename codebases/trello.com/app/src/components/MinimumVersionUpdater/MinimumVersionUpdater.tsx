import React, { FunctionComponent, useEffect, useState } from 'react';
import { client } from '@trello/config';
import { defaultRouter } from 'app/src/router';
import { useFeatureFlag } from '@trello/feature-flag-client';
import { Spinner } from '@trello/nachos/spinner';
import styles from './MinimumVersionUpdater.less';
import Cookies from 'js-cookie';
import { isDesktop } from '@trello/browser';

interface ClientChecks {
  clientHead?: string;
  clientVersion?: number;
  isDesktopClient?: boolean;
}

export const MINIMUM_REQUIRED_VERSION_FLAG = 'web.minimum-required-version';
export const SHOULD_FORCE_REFRESH_FLAG =
  'web.minimum-required-version-should-force-refresh';

export const useMinimumRequiredVersionUpdater = (
  clientChecks: ClientChecks = {},
) => {
  // Passing this as params helps with testing.
  // There's currently a limitation on spying on named exports,
  // and passing the client.head|version instead of overriding
  // globally in tests is safer
  const {
    clientHead = client.head,
    clientVersion = client.version,
    isDesktopClient = isDesktop(),
  } = clientChecks;
  const minimumRequiredVersion = useFeatureFlag(
    MINIMUM_REQUIRED_VERSION_FLAG,
    0,
  );
  const shouldForceRefresh = useFeatureFlag(SHOULD_FORCE_REFRESH_FLAG, false);

  const [isUpdating, setIsUpdating] = useState(false);

  // If our client is below the minimum required version, and they
  // are on a 'build' head and not using a custom version cookie, we
  // will either subscribe to the next navigation and trigger a full page
  // refresh OR just force an immediate refresh (if the force refresh flag
  // is also enabled)
  const requiresUpgrade =
    !Cookies.get('head') &&
    clientHead === 'build' &&
    !isDesktopClient &&
    clientVersion < minimumRequiredVersion;
  const willForceRefresh = requiresUpgrade && shouldForceRefresh;

  // Scheduled refresh
  useEffect(() => {
    if (requiresUpgrade && !willForceRefresh) {
      const currentRoutePath = defaultRouter.getRoute().routePath;
      const unsubscribe = defaultRouter.subscribe(({ routePath }) => {
        if (currentRoutePath !== routePath) {
          setIsUpdating(true);
          window.location.reload();
        }
      });
      return unsubscribe;
    }
  }, [requiresUpgrade, willForceRefresh]);

  // Forced refresh
  useEffect(() => {
    if (requiresUpgrade && willForceRefresh) {
      setIsUpdating(true);
      window.location.reload();
    }
  }, [requiresUpgrade, willForceRefresh]);

  return { isUpdating, requiresUpgrade, willForceRefresh };
};

export const MinimumVersionUpdater: FunctionComponent = ({ children }) => {
  const { isUpdating } = useMinimumRequiredVersionUpdater();

  // If we have started refreshing the page, we don't want to render the app anymore
  // as it leads to a successful transition followed by the full page refresh
  if (isUpdating) {
    return <Spinner centered wrapperClassName={styles.spinner} />;
  }

  return <>{children}</>;
};
