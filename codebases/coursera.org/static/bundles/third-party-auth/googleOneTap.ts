import $ from 'jquery';

import memoize from 'js/lib/memoize';

import requestCountryCode from 'bundles/phoenix/template/models/requestCountryCode';
import socialPlugins from 'bundles/socialPlugins/lib';
import constants from 'bundles/third-party-auth/constants';
import Instrumentation from 'bundles/userModal/lib/instrumentation';

const isRequestFromChina = requestCountryCode === 'CN';

type GoogleOneTapNotification = {
  getDismissedReason: () => string;
  getNotDisplayedReason: () => string;
  getSkippedReason: () => string;
  isDisplayed: () => boolean;
  isDismissedMoment: () => boolean;
  isNotDisplayed: () => boolean;
  isSkippedMoment: () => boolean;
};

type GoogleOneTapAccounts = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  initialize: (options: object) => void;
  prompt: (handler: (notification: GoogleOneTapNotification) => void) => void;
};

type GoogleOneTapType = {
  accounts: { id: GoogleOneTapAccounts };
};

function nonce() {
  const dictionary = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  return [...dictionary]
    .sort(() => Math.random() - 0.5)
    .slice(0, 10)
    .join('');
}

// Memoized so initialization will only run once
const googleOneTap = {
  enabled: !isRequestFromChina,
  init: memoize(async () => {
    const Google = (await socialPlugins.googleOneTap()) as GoogleOneTapType;

    return Google.accounts.id;
  }),
  loaded: false,
  getStatusOrLogin() {
    // eslint-disable-next-line new-cap
    const deferred = $.Deferred();

    googleOneTap
      .init()
      .then((GoogleID: GoogleOneTapAccounts) => {
        function handleCredentialResponse({ credential }: { credential: string }) {
          deferred.resolve({ code: credential });
        }

        GoogleID.initialize({
          ...constants.google.init,
          callback: handleCredentialResponse,
          nonce: nonce(),
        });

        GoogleID.prompt((notification) => {
          if (notification.isDisplayed() && !notification.isSkippedMoment()) {
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
            Instrumentation.oneTapView();
          } else {
            // Sometimes google considers that user rejected prompt enough times to not show it anymore.
            // This is the only way to find out the reason why is not displayed
            // eslint-disable-next-line no-console
            console.log('[Google One Tap]:', notification.getNotDisplayedReason(), notification.getSkippedReason());

            if (notification.isDismissedMoment()) {
              Instrumentation.oneTapClose({ reason: notification.getDismissedReason() });
            }
          }
        });
      })
      .catch(deferred.reject);

    return deferred.promise();
  },
};

export default googleOneTap;
