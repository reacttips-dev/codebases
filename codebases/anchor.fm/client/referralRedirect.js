/**
 * This file is basically route handling for
 * the referrer "deferred links" that need to open
 * appropriate app store and drop cookies on iOS
 * http://blogs.innovationm.com/deferred-deep-linking-in-ios-with-universal-link/
 */
import Promise from 'bluebird';
import queryString from 'query-string';
import {
  getOpenInAppUrl,
  isIOS,
  windowUndefined,
} from '../helpers/serverRenderingUtils';
import { fetchStation, fetchStationIdFromVanitySlug } from './station';
import { receivePageMetadata } from './pageMetadata';
import { receiveReferralCode, receiveCallJoinCode } from './user';
import { stripHtml } from '../helpers/html';

export function redirectLegacyStationPageToVanityUrl(store, baseUrl) {
  return ({ history, match: { params } }) =>
    fetch(`${baseUrl}/api/station/${params.stationId}/vanityslug`, {
      method: 'GET',
    })
      .then(response => {
        if (response.status === 200) {
          return response.json();
        }
        return Promise.reject(new Error('Status not 200'));
      })
      .then(response => {
        if (response.slug) {
          history.replace(`/${response.slug}`);
          return Promise.resolve();
        }
        return Promise.reject(new Error('Response missing slug'));
      })
      .catch(() => {
        history.replace('/404', { status: 404 });
      });
}

// hotfix for '/me' path in vanity URL email
export function openInAppRedirect(store) {
  return (nextState, replace) => {
    if (windowUndefined()) {
      // do not attempt to redirect server-side; we can't inspect the browser
      return;
    }
    const { pathname, search } = nextState.location;
    const path = `${pathname}${search}`;
    if (path) {
      const redirectPath = getOpenInAppUrl(path);
      // TODO: this will not fall back to the app store; used for re-engagement
      recordAndFollowOutboundRedirectEvent(
        path === redirectPath ? '/' : redirectPath
      );
    }
  };
}

// arbitrary redirect
export function redirectToUrl(store, url) {
  return () => {
    if (windowUndefined()) {
      // do not attempt to redirect server-side; we can't inspect the browser
      return;
    }
    recordAndFollowOutboundRedirectEvent(url);
  };
}

function getStationIdFromReferralCode(baseUrl = '', referralCode) {
  return fetch(`${baseUrl}/api/referral/${referralCode}/station`).then(
    response => {
      if (response.status === 200) {
        return response.json().then(station => {
          if (station && station.stationId) {
            return station.stationId;
          }
          return Promise.reject(new Error('station information missing'));
        });
      }
      return Promise.reject(new Error('Status not 200'));
    }
  );
}

// modeled after OutboundLink component
function recordAndFollowOutboundRedirectEvent(url) {
  const params = {
    eventCategory: 'Outbound',
    eventAction: 'Redirect',
    eventLabel: url,
    transport: 'beacon',
    hitCallback: () => {
      document.location = url;
    },
  };
  // eslint-disable-next-line no-undef
  ga('send', 'event', params);
}

function fetchReferralCodeFromStationId(stationId) {
  return fetch(`/api/referral/${stationId}/code`, {
    method: 'GET',
    credentials: 'same-origin',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  })
    .then(response => {
      if (response.status === 200) {
        return response.json();
      }
      return Promise.reject(new Error('Status not 200'));
    })
    .then(response => response.code);
}

export function checkForVanityUrl(store, baseUrl) {
  return ({ history, location, match, route }) => {
    const slug = match.params.vanitySlug
      ? match.params.vanitySlug
      : location.pathname;
    return store
      .dispatch(fetchStationIdFromVanitySlug(baseUrl, slug))
      .then(response => {
        // server-side rendering "hacks"
        // eslint-disable-next-line no-param-reassign
        route.canonicalPath = `/${response.slug}`;
        // eslint-disable-next-line no-param-reassign
        match.params.stationId = response.stationId;
        // best effort save "referral" station IP
        saveReferralIp(baseUrl, {
          location,
          stationId: response.stationId,
        });
        return Promise.resolve();
      })
      .catch(err => {
        history.replace('/404', { status: 404 });
        return Promise.resolve();
      });
  };
}

export function storeCampaign(store) {
  return props => {
    const {
      location: { search },
    } = props;
    const query = queryString.parse(search);
    if (query.utm_campaign) {
      store.dispatch(
        receivePageMetadata({
          campaign: stripHtml(query.utm_campaign),
        })
      );
    }
  };
}

export function setCanonicalEpisodePathAndGetReferralCodeForEpisode(store) {
  return ({ match: { params }, route }) => {
    const { episodeId } = params;
    // eslint-disable-next-line no-param-reassign
    route.canonicalPath = `/rr/${episodeId}`;
    if (windowUndefined()) {
      // do not attempt to check codes/etc server-side
    }
  };
}

export function saveReferralIp(baseUrl, props) {
  if (windowUndefined()) {
    // do not run server-side / we need true client IP
    return;
  }
  const { episodeId, location, stationId } = props;
  if (location.action === 'PUSH') {
    // check for navigating to this page via <Link> and not landing on it
    // allow regular browsing
    return;
  }
  fetch('/api/v3/referral/ip', {
    method: 'POST',
    credentials: 'same-origin',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify({
      webEpisodeId: episodeId,
      webStationId: stationId,
    }),
  });
}

export function getReferralCodeFromCallInvite(store) {
  return props => {
    const {
      match: { params, path },
    } = props;
    if (windowUndefined()) {
      // do not attempt to check codes/etc server-side

      // 1337 hack to make sure the RWF page has the correct image metadata for SSR
      // this must be here because it will get set while the page is being rendered
      // server-side. Putting it into the container component for RWF ends up only
      // being set client-side, which will not show the images below when unfurled
      if (path === '/:vanitySlug/call/:callJoinCode') {
        store.dispatch(
          receivePageMetadata({
            image:
              'https://d12xoj7p9moygp.cloudfront.net/images/social/opengraph-record-with-friends.png',
            twitterImage:
              'https://d12xoj7p9moygp.cloudfront.net/images/social/opengraph-twitter-record-with-friends.png',
          })
        );
      }
      return;
    }
    if (params) {
      const { callJoinCode, vanitySlug } = params;
      if (callJoinCode) {
        store.dispatch(receiveCallJoinCode(callJoinCode));
      }
      fetchReferralCodeFromVanitySlug(vanitySlug).then(referralResponse => {
        if (referralResponse && referralResponse.stationId) {
          store.dispatch(fetchStation('', referralResponse.stationId));
        }
      });
    }

    function fetchReferralCodeFromVanitySlug(vanitySlug) {
      return fetch(`/api/vanityslug?url=${vanitySlug}`, {
        method: 'GET',
      })
        .then(response => {
          if (response.status === 200) {
            return response.json();
          }
          return Promise.reject(new Error('Status not 200'));
        })
        .then(response => {
          if (response.stationId) {
            return fetchReferralCodeFromStationId(response.stationId).then(
              referralCode => {
                if (referralCode) {
                  store.dispatch(receiveReferralCode(referralCode));
                  if (isIOS()) {
                    return fetch('/api/referrallookup', {
                      method: 'POST',
                      credentials: 'same-origin',
                      headers: new Headers({
                        'Content-Type': 'application/json',
                      }),
                      body: JSON.stringify({
                        referralCode,
                      }),
                    }).then(() => ({
                      referralCode,
                      stationId: response.stationId,
                    }));
                  }
                }
                return {
                  referralCode,
                  stationId: response.stationId,
                };
              }
            );
          }
          return Promise.resolve();
        })
        .catch(() =>
          // don't fail to render component
          Promise.resolve()
        );
    }
  };
}

export function redirectToPath(store, pathname) {
  return ({ history }) => {
    history.replace({ pathname });
  };
}
