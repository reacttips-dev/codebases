import {
  CLIENT_VIEW_TRACKED,
  LOCATION_INIT,
  LOCATION_UPDATED,
  PAGE_TYPE_CHANGE,
  ROUTE_UPDATE_COMPLETE
} from 'constants/reduxActions';
import { getType } from 'history/historyFactory';

// We call LOCATION_UPDATED with 'pdp' instead of 'product'. Making sure it's consistent here as 'product'.
const NORMALIZE_PAGE_TYPE_MAP = {
  'pdp': 'product'
};
export const getCleanPageType = type => NORMALIZE_PAGE_TYPE_MAP[type] || type;

export const initialState = { clientRoutedUrls: [] };

const MAX_STORED_CLIENT_ROUTED_ENTRIES = 10;
export default function pageView(state = initialState, action) {
  const { type, location, zfcMetadata, initPath, pageType } = action;
  switch (type) {
    case LOCATION_INIT:
      return { ...state, pageType: getCleanPageType(getType(initPath)) };
    case PAGE_TYPE_CHANGE:
      return { ...state, pageType: getCleanPageType(pageType) };
    case ROUTE_UPDATE_COMPLETE:
      return { ...state, routeUpdated: !!state.needsToFire };
    case LOCATION_UPDATED:
      return { ...state, location: location, pageType: getCleanPageType(getType(location.pathname)), needsToFire: location.action !== 'REPLACE' || state.needsToFire };
    case CLIENT_VIEW_TRACKED:
      // set need to fire track.cgi flag off and store (for testing/debugging purposes) what was tracked
      const currentLength = state.clientRoutedUrls.length;
      const { pathname, search, hash } = state.location;
      const clientRoutedUrls = state.clientRoutedUrls.slice(currentLength >= MAX_STORED_CLIENT_ROUTED_ENTRIES ? currentLength + 1 - MAX_STORED_CLIENT_ROUTED_ENTRIES : 0);
      clientRoutedUrls.push({
        url: pathname + search + hash,
        zfcMetadata
      });
      return { ...state, needsToFire: false, routeUpdated: false, clientRoutedUrls };
    default:
      return state;
  }
}
