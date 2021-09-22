import _ from 'underscore';
import $ from 'jquery';
import socialPlugins from 'bundles/socialPlugins/lib';
import constants from 'bundles/third-party-auth/constants';
import memoize from 'js/lib/memoize';
import requestCountryCode from 'bundles/phoenix/template/models/requestCountryCode';
import { ThirdPartyVendor } from 'bundles/third-party-auth/types';

const isRequestFromChina = requestCountryCode === 'CN';

type FacebookType = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  init: (options: object) => void;
};

const deferResponse = function (deferred: $TSFixMe, response: $TSFixMe) {
  if (response.status === 'connected') {
    deferred.resolve(response);
  } else if (response.status === 'not_authorized') {
    // The person is logged into Facebook, but not your app.
    deferred.reject({ code: 'notAuthorized' });
  } else {
    // The person is not logged into Facebook, so we're not sure if
    // they are logged into this app or not.
    deferred.reject({ code: 'unknownStatus' });
  }
};

const facebook: ThirdPartyVendor = {
  enabled: !isRequestFromChina,
  // Memoized so initialization will only run once
  // @ts-expect-error ts-migrate(2322) FIXME: Type '{ (): Promise<FacebookType>; force(): Promis... Remove this comment to see the full error message
  init: memoize(async () => {
    const FB = (await socialPlugins.facebook()) as FacebookType;

    FB.init(constants.facebook.init);

    return FB;
  }),
  getStatusOrLogin(loginParams: $TSFixMe) {
    // eslint-disable-next-line new-cap
    const deferred = $.Deferred();
    facebook
      .init()
      .then(function (FBID: $TSFixMe) {
        FBID.getLoginStatus((response: { status: string }) => {
          if (response.status === 'connected') {
            deferred.resolve(response);
          } else {
            FBID.login(deferResponse.bind(null, deferred), _.extend({}, constants.facebook.loginParams, loginParams));
          }
        });
      })
      .catch(() => deferred.reject({ code: 'unknownStatus' }));
    return deferred.promise();
  },
};

// NOTE: As of 2/18/15, chrome and safari seem to block popups from the facebook auth flow if we use Q promises.
// However, if we switch to jQuery promises, everything seem to work. It's truly mind boggling.
// As a result, we init, login, and getLoginStatus methods return a jQuery promise and getStatusOrLogin returs a Q
// promise.

export default facebook;
