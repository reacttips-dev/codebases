import { LOAD_PIXEL_SERVER } from 'constants/reduxActions';
import { postMartyPixel } from 'apis/martyPixel';
import { getPageLang, getPageTitle } from 'helpers/ClientUtils';
import { fetchMartyPixelErrorMiddleware } from 'middleware/fetchErrorMiddleware';
import logger from 'middleware/logger';

/**
 * Invokes the pixel server with the data given via arguments plus some global
 * stuff.
 *
 * @param {String} pageType
 * the "pageType" key from the pixel bucket
 *
 * @param {Object} [trackingPayload={}]
 * additional data to post to the server for this pageType
 *
 * @param {String} [pageId='']
 * an additional identifer when combined with pageType to use when determining
 * when to fire the pixel server message. For instance to identify client
 * routing between different product pages. (not sent to pixel server)
 */
export function firePixelServer(pageType, trackingPayload = {}, pageId = '') {
  return function(dispatch, getState) {
    const action = makePixelServerAction(getState(), pageType, trackingPayload, pageId);
    dispatch(action);
  };
}

export function makePixelServerAction(state, pageType, trackingPayload = {}, pageId = '') {
  const {
    routing: {
      locationBeforeTransitions: { search }
    },
    cookies
  } = state;
  // data.pageId field is used to "cache bust" for pixel pages with no
  // parameters and the same pageType (e.g landing pages).
  return {
    type: LOAD_PIXEL_SERVER,
    pageType,
    data: {
      customerCountryCode: extractCustomerCountryCode(cookies),
      pageId,
      pageLang: getPageLang(),
      pageTitle: getPageTitle(),
      ...trackingPayload
    },
    queryString: search
  };
}

export function extractCustomerCountryCode(cookies) {
  return cookies.geo?.split('/')[0] || null;
}

export function fireMartyPixel(qs, type, endpoints = { postMartyPixel }) {
  return function() {
    return endpoints.postMartyPixel(`type=${type}&${qs}`)
      .then(fetchMartyPixelErrorMiddleware)
      .catch(() => {
        logger('Unable to get valid response from /martypixel endpoint, not firing marty pixel server.');
      });
  };
}
