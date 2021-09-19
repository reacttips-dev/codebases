import { setFederatedLoginModalVisibility } from 'actions/headerfooter';
import { REDIRECT } from 'constants/reduxActions';
import { prependAppRoot } from 'history/AppRootUtils';
import { buildAuthenticationRedirectUrl } from 'utils/redirect';
import marketplace from 'cfg/marketplace.json';

const { hasFederatedLogin, search: { hasSeoUrls } } = marketplace;

export const OOS_REDIRECT_SUFFIX = '?oosRedirected=true';

export function redirectTo(urlFragment, status = 302) {
  return {
    type: REDIRECT,
    location: urlFragment,
    status
  };
}

export function asyncRedirectTo(url, status = 302, timeout = 50) {
  return dispatch => {
    setTimeout(() => {
      dispatch(redirectTo(url, status));
    }, timeout);
  };
}

export function redirectWithAppRoot(route) {
  return (dispatch, getState) => {
    const { routing: { locationBeforeTransitions } } = getState();
    dispatch(redirectTo(prependAppRoot(route, locationBeforeTransitions)));
    return Promise.resolve();
  };
}

export function redirectToSearch(seoTerm) {
  // redirect to pretty URL for search. If we use /search?term=${seoTerm} zfc
  // could strip out the actual oosRedirected flag.
  if (hasSeoUrls) {
    return redirectWithAppRoot(`/${seoTerm}${OOS_REDIRECT_SUFFIX}`);
  } else {
    return redirectWithAppRoot(`/search${OOS_REDIRECT_SUFFIX}&term=${seoTerm}`);
  }
}

/**
 * Returns a `redirectTo` action to login with the login return URL being the
 * provided location.
 *
 * @param {Object} Location object with pathname and search fields. URL to
 *                 return to upon successful authentication.
 * @param {string|undefined} [redirectOnClose] -> string path to redirect if the login modal closes
 */
export const redirectToAuthenticationFor = ({ pathname, search, hash = '' }, redirectOnClose) => {
  const encodedUriComponent = encodeURIComponent(`${pathname}${search}${hash}`);
  const authRedirectUrl = buildAuthenticationRedirectUrl(encodedUriComponent);

  return (dispatch, getState) => {
    const state = getState();
    const { pageView: { pageType: sourcePageType } = {} } = state;

    if (hasFederatedLogin) {
      return dispatch(setFederatedLoginModalVisibility(true, { returnTo: encodedUriComponent, redirectOnClose, sourcePageType }));
    } else {
      return dispatch(redirectTo(authRedirectUrl));
    }
  };
};
