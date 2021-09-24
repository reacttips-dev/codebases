'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { memo } from 'react';
import IndexDataLoader from './IndexDataLoader';
import { useSyncRouterValuesToRedux } from '../hooks/useSyncRouterValuesToRedux';
import { useSyncRouterValuesToCache } from '../hooks/useSyncRouterValuesToCache';
import { useSelectedObjectTypeId } from '../../../objectTypeIdContext/hooks/useSelectedObjectTypeId';
import ErrorBoundary from 'customer-data-objects-ui-components/ErrorBoundary';
import FullPageError from '../../../errorBoundary/FullPageError';
import PageLoadingSpinner from './PageLoadingSpinner';
import IndexPageAlerts from '../../../alerts/IndexPageAlerts';
/*
 * Extracting this as a memoized component prevents the entire component
 * tree from rerendering when the router values change. This way we only ever listen to the
 * values that come from redux, not those that come from IndexRoute's props. As we transition
 * more to graphql/component state-based solutions we may be able to stop syncing values entirely.
 * The main blocker is data fetching. Once we no longer need objectTypeId for data fetching,
 * we can probably dispense with the whole sync flow entirely.
 */

var IndexRouteChildren = /*#__PURE__*/memo(function (_ref) {
  var objectTypeId = _ref.objectTypeId;
  return /*#__PURE__*/_jsxs(ErrorBoundary, {
    ErrorComponent: FullPageError,
    boundaryName: objectTypeId + "_FullPageError",
    children: [/*#__PURE__*/_jsx(IndexPageAlerts, {}), /*#__PURE__*/_jsx(IndexDataLoader, {})]
  });
});
/*
 * This component is the entry point for the index route (objects/:objectTypeId/views/:viewId/:pageType).
 *
 * This is what the waterfall of components and their responsibilities looks like for this route:
 *
 * IndexRoute: Syncs router values to redux **and cache**. When object type is synced, renders IndexDataLoader.
 * IndexDataLoader: Fetches data. During fetch renders loading. On error renders error state. On success, renders IndexPageContainer.
 * IndexViewRedirect: Checks that view/pagetype are specified in the url and are valid. If not, redirects to put valid values in the url. If so, renders IndexPageContainer.
 * IndexPageContainer: Handles "special" query params such as filters/columns, and decides which version of the page to render (redux vs graphql).
 * IndexPageWithReduxSearch: Hits elasticsearch using the redux infrastructure. Always renders IndexPage.
 * IndexPageWithCrmSearch: Hits elasticsearch wtih graphql. Always renders IndexPage.
 * IndexPage: This is the start of app code and renders the page layout.
 *
 * A little bit more about the sync logic:
 *
 * We typically go through two rounds of syncing: One to sync objectTypeId, then another that syncs any values that were missing from the url.
 * objectTypeId is always required, and is a blocker for data fetching. Once we know objectTypeId, we know enough to fetch 95% of the page's data.
 * Once our data is fetched, we use that data to determine what to do about missing values for viewId, pageType, or search query (our secondary params).
 * IndexViewRedirect handles this logic. This process repeats for every change in the url over the app's runtime.
 */

var IndexRoute = function IndexRoute() {
  useSyncRouterValuesToCache();
  var hasCompletedInitialReduxSync = useSyncRouterValuesToRedux();
  var objectTypeId = useSelectedObjectTypeId();

  if (!hasCompletedInitialReduxSync) {
    return /*#__PURE__*/_jsx(PageLoadingSpinner, {});
  }

  return /*#__PURE__*/_jsx(IndexRouteChildren, {
    objectTypeId: objectTypeId
  });
};

export default IndexRoute;