'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { useSyncRouterValuesToRedux } from '../hooks/useSyncRouterValuesToRedux';
import { useSelectedObjectTypeId } from '../../../objectTypeIdContext/hooks/useSelectedObjectTypeId';
import RestoreDataLoader from './RestoreDataLoader';
import PageLoadingSpinner from './PageLoadingSpinner';
import ErrorBoundary from 'customer-data-objects-ui-components/ErrorBoundary';
import FullPageError from '../../../errorBoundary/FullPageError';
/*
 * This component is the entry point for the restore route (objects/:objectTypeId/restore).
 *
 * This is what the waterfall of components and their responsibilities looks like for this route:
 *
 * RestoreRoute: Syncs router values to redux, **but not cache**. When object type is synced, renders RestoreDataLoader.
 * RestoreDataLoader: Fetches data. During fetch renders loading. On error renders error state. On success, renders RestorePage.
 * RestorePage: Restores data from cache, then uses that data to format a url for the standard route.
 *
 * RestorePage then redirects to that url, and from there the waterfall proceedes as normal for the standard route.
 */

var RestoreRoute = function RestoreRoute() {
  // Unlike IndexRoute, we intentionally do not call useSyncRouterValuesToCache here.
  // If we did, we'd be overwriting the cache that we are restoring from.
  var hasCompletedInitialReduxSync = useSyncRouterValuesToRedux();
  var objectTypeId = useSelectedObjectTypeId();

  if (!hasCompletedInitialReduxSync) {
    return /*#__PURE__*/_jsx(PageLoadingSpinner, {});
  }

  return /*#__PURE__*/_jsx(ErrorBoundary, {
    ErrorComponent: FullPageError,
    boundaryName: objectTypeId + "_FullPageError",
    children: /*#__PURE__*/_jsx(RestoreDataLoader, {})
  });
};

export default RestoreRoute;