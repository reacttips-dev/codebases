import {
  RECEIVE_AND_DEFER_SEARCH_RESPONSE,
  RECEIVE_SEARCH_RESPONSE,
  REQUEST_SEARCH,
  SET_SEARCH_OOS_MESSAGING,
  TRACK_MSFT_AD_IMPRESSIONS,
  UPDATE_SEARCH_LIMIT
} from 'constants/reduxActions';
import {
  createViewSearchPageMicrosoftUetEvent,
  pushMicrosoftUetEvent
} from 'actions/microsoftUetTag';
import { firePixelServer } from 'actions/pixelServer';
import { trackError } from 'helpers/ErrorUtils';
import { formatMicrosoftPixelData } from 'helpers/SearchUtils';
import timedFetch from 'middleware/timedFetch';

export function requestSearch({ url, isFresh }) {
  return {
    type: REQUEST_SEARCH,
    url,
    isFresh
  };
}

export function receiveSearchResponse(response) {
  return {
    type: RECEIVE_SEARCH_RESPONSE,
    response
  };
}

export function setOosMessaging(response) {
  return {
    type: SET_SEARCH_OOS_MESSAGING,
    response
  };
}

export function fireSearchPixels(term, results, pixelFacetData, filters) {
  results = results || [];
  return dispatch => {
    const microsoftUetEvent = createViewSearchPageMicrosoftUetEvent(term, results.map(result => result.productId));
    dispatch(pushMicrosoftUetEvent(microsoftUetEvent));
    dispatch(firePixelServer('search', {
      stringResults: formatMicrosoftPixelData({ filters, results }),
      results: results.map(result => ({
        sku: result.productId,
        styleId: result.styleId
      })),
      facets: pixelFacetData, term
    }));
  };
}

export function updateProductLimit(limit) {
  return {
    type: UPDATE_SEARCH_LIMIT,
    limit
  };
}

// If HYDRA_BRAND_NAME_SEARCH is not made permanent, this action and all its
// associated functionality can be removed.
export function receiveAndDeferSearchResponse(deferredSearchResponse) {
  return {
    type: RECEIVE_AND_DEFER_SEARCH_RESPONSE,
    deferredSearchResponse
  };
}

export const trackMicrosoftAdImpressions = ({ url }, fetcher = timedFetch) => dispatch => {
  const fetch = fetcher('MicrosoftAdImpressions');
  dispatch({ type: TRACK_MSFT_AD_IMPRESSIONS });
  fetch(url)
    .catch(error => trackError('ERROR', 'Failed to send MSFT impression events', error));
};
