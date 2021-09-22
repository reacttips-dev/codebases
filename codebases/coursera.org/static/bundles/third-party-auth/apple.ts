import $ from 'jquery';

import socialPlugins from 'bundles/socialPlugins/lib';

import memoize from 'js/lib/memoize';

import constants from 'bundles/third-party-auth/constants';
import { ThirdPartyVendor } from 'bundles/third-party-auth/types';

type AppleType = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  auth: { init: (options: object) => void };
};
// Memoized so initialization will only run once
const apple: ThirdPartyVendor = {
  // @ts-expect-error ts-migrate(2322) FIXME: Type '{ (): Promise<{ init: (options: object) => v... Remove this comment to see the full error message
  init: memoize(async () => {
    const Apple = (await socialPlugins.apple()) as AppleType;

    const options = constants.apple.init;

    if (window) {
      options.redirectURI = window.location.origin;
    }

    Apple.auth.init(options);

    return Apple.auth;
  }),

  getStatusOrLogin() {
    // eslint-disable-next-line new-cap
    const deferred = $.Deferred();

    apple
      .init()
      .then((AppleID) => {
        return AppleID.signIn();
      })
      .then((...argv) => {
        deferred.resolve(...argv);
      })
      .catch(({ error }) => {
        // @link https://developer.apple.com/documentation/sign_in_with_apple/sign_in_with_apple_js/configuring_your_webpage_for_sign_in_with_apple
        if (error === 'user_cancelled_authorize') {
          deferred.reject({ code: 'notAuthorized' });
        } else {
          // Handles `popup_closed_by_user`
          deferred.reject({ code: 'unknownStatus' });
        }
      });

    return deferred.promise();
  },
};

export default apple;
