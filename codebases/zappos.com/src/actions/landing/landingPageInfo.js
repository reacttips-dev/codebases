import ExecutionEnvironment from 'exenv';

import {
  RECEIVE_LANDING_PAGE_INFO,
  RECEIVE_RESET_LANDING_PAGE_INFO,
  RECEIVE_SYMPHONY_PREVIEW_INFO,
  RECEIVE_TAXONOMY_BRAND_PAGE_INFO,
  REDIRECT,
  REQUEST_LANDING_PAGE_INFO,
  REQUEST_SYMPHONY_PREVIEW_INFO,
  REQUEST_TAXONOMY_BRAND_PAGE_INFO,
  SET_DOC_META_LP,
  SET_IP_RESTRICTED_STATUS,
  TOGGLE_EASYFLOW_MODAL
} from 'constants/reduxActions';
import { getLandingPageInfo, getSymphonyPreviewInfo, getSymphonySlots, getTaxonomyBrandPageInfo } from 'apis/mafia';
import { getIpRestricted } from 'apis/outcom';
import { fetchErrorMiddleware } from 'middleware/fetchErrorMiddleware';
import { err, setError } from 'actions/errors';
import { setFederatedLoginModalVisibility } from 'actions/headerfooter';
import { IS_NUMBER_RE, ZCS_VALID_PAGE_NAME_RE } from 'common/regex';
import { absoluteImageUrl } from 'helpers/productImageHelpers';
import { trackError } from 'helpers/ErrorUtils';
import { buildAuthenticationRedirectUrl } from 'utils/redirect';
import { processHeadersMiddleware } from 'middleware/processHeadersMiddlewareFactory';
import { setSessionCookies } from 'actions/session';
import { fetchRecos } from 'actions/recos';
import { buildRecosKey } from 'helpers/RecoUtils';
import marketplace from 'cfg/marketplace.json';

const { hasFederatedLogin } = marketplace;

export function resetLandingPageInfo() {
  return {
    type: RECEIVE_RESET_LANDING_PAGE_INFO
  };
}

export function requestLandingPageInfo(pageName) {
  return {
    type: REQUEST_LANDING_PAGE_INFO,
    pageName
  };
}

export function receiveLandingPageResponse(pageInfo, pageName) {
  return {
    type: RECEIVE_LANDING_PAGE_INFO,
    pageName,
    pageInfo
  };
}

export function requestSymphonyPreviewInfo(slot) {
  return {
    type: REQUEST_SYMPHONY_PREVIEW_INFO,
    slot
  };
}

export function receiveSymphonyPreviewResponse(pageInfo, slot) {
  return {
    type: RECEIVE_SYMPHONY_PREVIEW_INFO,
    slot,
    pageInfo
  };
}

export function requestTaxonomyBrandPageInfo(brandId) {
  return {
    type: REQUEST_TAXONOMY_BRAND_PAGE_INFO,
    brandId
  };
}

export function receiveTaxonomyBrandPageResponse(pageInfo, brandId, pageName) {
  return {
    type: RECEIVE_TAXONOMY_BRAND_PAGE_INFO,
    pageInfo,
    brandId,
    pageName
  };
}

export function toggleEasyFlowModal(isEasyFlowShowing) {
  return {
    type: TOGGLE_EASYFLOW_MODAL,
    isEasyFlowShowing
  };
}

function brandNotFound(errorMsg) {
  return setError(errorMsg, null, 404);
}

export function landingPageAuthRedirect(pageName) {
  return {
    type: REDIRECT,
    location: buildAuthenticationRedirectUrl(`/c/${pageName}`)
  };
}

export function fetchAllRecommenderDataIfNecessary(slotData = {}, fetchRecosData = fetchRecos) {
  return (dispatch, getState) => {
    if (!ExecutionEnvironment.canUseDOM) {
      return;
    }
    const { recos = {} } = getState();
    const { janus = {} } = recos;
    let recoLimit = 0;
    const allRecommenders = Object.values(slotData)
      .filter(({ componentName }) => (componentName === 'recommender'))
      .filter(slotDetails => !janus[buildRecosKey(slotDetails)]);

    if (allRecommenders.length) {
      let widget = allRecommenders.filter(({ widget }) => !!widget);
      if (widget.length) {
        widget = widget.map(({ widget, limit }) => (recoLimit = recoLimit || limit, widget));
      } else {
        widget = null;
      }

      const allFilters = [];
      allRecommenders.forEach(({ filters, limit, pf_rd_p: recoId }) => {
        recoLimit = recoLimit || limit;
        (filters || []).forEach(f => allFilters.push({ ...f, recoId }));
      });
      dispatch(fetchRecosData({ widget, filters: allFilters, limit: recoLimit }));
    }
  };
}

// Incase any components need data massaging before being put into the redux state
export const cleanResponse = (response = {}) => {
  const { slotData = {} } = response;
  const newResponse = { ...response };
  const newSlotData = Object.entries(slotData).reduce((acc, [key, slot]) => {
    const { componentName, sortByTime, item, sizeoptions, iprestricted } = slot;
    // Order release calendar items by their time released if sortByTime is passed
    if (componentName === 'releaseCalendar' && sortByTime === 'true' && Array.isArray(item)) {
      slot.item = item.sort((a, b) => new Date(a.time) - new Date(b.time));
    }
    // Clean up size options for raffle from string to array
    if (componentName === 'raffle' && sizeoptions?.length) {
      slot.sizeoptions = sizeoptions.split(',');
    }
    // On the top response level set a flag so we know we need to call endpoint to see if we're in an IP range,
    // based on response from outcom endpoint
    if (iprestricted?.toString() === 'true') {
      newResponse.ipRestrictedContentPresent = true;
    }
    acc[key] = slot;
    return acc;
  }, {});
  return { ...newResponse, slotData: newSlotData };
};

/**
 * Fetch the landing page info for a given page.
 * @param  {string} pageName                                    name of the landing page
 * @param  {function} [getLandingPageApi = getLandingPageInfo]  mafia endpoint to fetch landing page info
 * @return {function}                                           a redux thunk
 */
export function fetchLandingPageInfo(pageName, location = {}, getLandingPageApi = getLandingPageInfo, fetchAllRecommenderDataIfNecessaryFn = fetchAllRecommenderDataIfNecessary) {
  return (dispatch, getState) => {
    dispatch(requestLandingPageInfo(pageName));
    if (!ZCS_VALID_PAGE_NAME_RE.test(pageName)) {
      dispatch(setError(err.GENERIC, new Error('Invalid Landing page'), 404));
      return Promise.resolve();
    }
    const state = getState();
    const { cookies, client: { request }, environmentConfig: { api: { mafia } } } = state;
    return getLandingPageApi(mafia, { pageName }, cookies, request, location)
      .then(processHeadersMiddleware(setSessionCookies(dispatch, getState)))
      .then(fetchErrorMiddleware)
      .then(response => {
        const { pageType, customerAuth } = response;
        if (pageType === '404') {
          dispatch(setError(err.GENERIC, new Error('Landing page does not exist...'), 404));
        } else if (pageType === 'AuthenticationFull' && customerAuth !== 'FULL') {
          if (hasFederatedLogin) {
            const returnTo = state.routing.locationBeforeTransitions.pathname;
            dispatch(setFederatedLoginModalVisibility(true, { returnTo, redirectOnClose: '/' }));
          } else {
            return dispatch(landingPageAuthRedirect(pageName));
          }
        } else {
          const cleanedResponse = cleanResponse(response);
          const { slotData } = cleanedResponse;
          dispatch(fetchAllRecommenderDataIfNecessaryFn(slotData));
          dispatch(receiveLandingPageResponse(cleanedResponse, pageName));
        }
      })
      .catch(e => {
        dispatch(setError(err.GENERIC, e));
      });
  };
}

/**
 * Fetch the Symphony Preview info for a given creative.
 * @param  {string} slot                                    parameters sent from Symphony
 * @param  {function} [getSymphonyPreviewApi = getSymphonyPreviewInfo]  mafia endpoint to fetch Symphony creative info
 * @return {function}                                           a redux thunk
 */
export function fetchSymphonyPreviewInfo(slot, getSymphonyPreviewApi = getSymphonyPreviewInfo) {
  return (dispatch, getState) => {
    dispatch(requestSymphonyPreviewInfo(slot));
    const { cookies, environmentConfig: { api: { mafia } } } = getState();
    return getSymphonyPreviewApi(mafia, slot, cookies)
      .then(fetchErrorMiddleware)
      .then(response => dispatch(receiveSymphonyPreviewResponse(response, slot)))
      .catch(e => {
        dispatch(setError(err.GENERIC, e));
      });
  };
}

export function loadLandingPage() {
  const args = arguments;
  return function(dispatch, getState) {
    return dispatch(fetchLandingPageInfo(...args))
      .then(() => {
        const { landingPage: { pageName, pageInfo } } = getState();
        // avoid superfluous logging for 404s.
        if (pageInfo) {
          dispatch(loadedLandingPage(pageName, pageInfo));
        }
      });
  };
}

export function loadedLandingPage(pageName, pageInfo) {
  return {
    type: SET_DOC_META_LP,
    pageName,
    pageInfo
  };
}

export function processReceivedTaxonomyBrandPageResponse(response, brandId, dispatch, getState) {
  const { environmentConfig: { imageServer: { url: imageServerUrl } } } = getState();
  if (response.pageType && response.brandName === null) {
    dispatch(brandNotFound(err.BRAND_INFO));
  } else {
    const { slotData: { 'primary-8': { about } } } = response;
    const pageName = `brand-${brandId}`;
    if (about.headerImageUrl) {
      about.headerImageUrl = absoluteImageUrl(about.headerImageUrl, imageServerUrl);
    }
    dispatch(receiveTaxonomyBrandPageResponse(response, brandId, pageName));
  }
}

/**
 * Fetch the brand landing page info
 * @param  {function} [getBrandPageApi = getBrandPageInfo]  mafia endpoint to fetch landing page info
 * @return {function}                                       a redux thunk
 */
export function fetchTaxonomyBrandPage(brandId, getTaxonomyBrandPageApi = getTaxonomyBrandPageInfo) {
  return (dispatch, getState) => {
    dispatch(requestTaxonomyBrandPageInfo(brandId));
    if (IS_NUMBER_RE.test(brandId)) {
      const { cookies, client: { request }, environmentConfig: { api: { mafia } } } = getState();
      return getTaxonomyBrandPageApi(mafia, brandId, cookies, request)
        .then(fetchErrorMiddleware)
        .then(response => processReceivedTaxonomyBrandPageResponse(response, brandId, dispatch, getState))
        .catch(errorEvent => {
          dispatch(setError(err.GENERIC, errorEvent));
        });
    } else {
      return dispatch(brandNotFound(err.BRAND_INFO));
    }
  };
}

export function setIpRestrictedStatus(ipStatus) {
  return {
    type: SET_IP_RESTRICTED_STATUS,
    ipStatus
  };
}

export function getIpRestrictedStatus() {
  return dispatch => getIpRestricted()
    .then(response => dispatch(setIpRestrictedStatus(response)))
    .catch(e => trackError('NON-FATAL', 'Could not get restricted IP status.', e));
}

export function fetchSymphonyContentByPageLayout({ pageLayout, pageName }, symphonySlotFetcher = getSymphonySlots) {
  return (dispatch, getState) => {
    const state = getState();
    const { environmentConfig: { api: { mafia } }, cookies } = state;
    return symphonySlotFetcher(mafia, { pageName, pageLayout }, cookies)
      .then(fetchErrorMiddleware)
      .then(response => {
        const cleanedResponse = cleanResponse(response);
        dispatch(receiveLandingPageResponse(cleanedResponse));
      })
      .catch(err => {
        trackError('NON-FATAL', `Failed to fetch content for page layout: ${pageLayout}`, err);
      });
  };
}
