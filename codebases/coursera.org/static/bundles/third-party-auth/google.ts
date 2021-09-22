import $ from 'jquery';
import memoize from 'js/lib/memoize';

import requestCountryCode from 'bundles/phoenix/template/models/requestCountryCode';
import socialPlugins from 'bundles/socialPlugins/lib';

import constants from 'bundles/third-party-auth/constants';

const isRequestFromChina = requestCountryCode === 'CN';

type GoogleType = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  auth2: { init: (options: object) => Promise<unknown> };
  load: (plugin: string, success: () => void) => void;
};

type GoogleProfile = {
  getEmail: () => string;
};

type GoogleUser = {
  getBasicProfile: () => GoogleProfile;
};

type GoogleAuthType = {
  currentUser: {
    get: () => GoogleUser;
    listen: (handler: (user: GoogleUser) => void) => void;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  grantOfflineAccess: () => Promise<any>;
};

// Memoized so initialization will only run once
const google = {
  enabled: !isRequestFromChina,
  init: memoize(async () => {
    const Google = (await socialPlugins.google()) as GoogleType;

    return new Promise((ok, ko) => {
      Google.load('auth2', async () => {
        try {
          ok(await Google.auth2.init(constants.google.init));
        } catch (e) {
          ko(e);
        }
      });
    });
  }),
  loaded: false,
  getStatusOrLogin() {
    // eslint-disable-next-line new-cap
    const deferred = $.Deferred();

    google
      .init()
      // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '(GoogleID: GoogleAuthType) => vo... Remove this comment to see the full error message
      .then((GoogleID: GoogleAuthType) => {
        GoogleID.grantOfflineAccess()
          .then((response) => {
            const profile = GoogleID.currentUser.get().getBasicProfile();

            if (profile) {
              const email = profile.getEmail();

              deferred.resolve({ ...response, email });
            } else {
              GoogleID.currentUser.listen((user) => {
                const email = user?.getBasicProfile()?.getEmail();

                if (email) {
                  deferred.resolve({ ...response, email });
                } else {
                  deferred.reject({ code: 'notAuthorized' });
                }
              });
            }
          })
          .catch((error) => {
            // @link https://developers.google.com/identity/sign-in/web/reference#googleauthgrantofflineaccessoptions
            if (error === 'access_denied') {
              deferred.reject({ code: 'notAuthorized' });
            } else {
              // Handles `popup_closed_by_user` and `immediate_failed`
              deferred.reject({ code: 'unknownStatus' });
            }
          });
      })
      // Only possible error is due to unsupported environment (ie: no cookies supported)
      // @see https://developers.google.com/identity/sign-in/web/reference#googleauththenoninit_onerror
      .catch(() => deferred.reject({ code: 'unknownError' }));

    return deferred.promise();
  },
};

export default google;
