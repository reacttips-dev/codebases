import { appId, snowplowCloudfrontServer } from '@trello/config';
import { memberId } from '@trello/session-cookie';
import { trackGTMEvent } from './googleTagManager';
import { TrelloWindow, SnowplowConfig } from '@trello/window-types';
declare const window: TrelloWindow;

interface SnowplowInstanceRef {
  cf: {
    getDomainUserId: () => string;
  };
}

export const initialize = function () {
  if (!window.sp) {
    return;
  }

  const snowplow = window.sp;

  /*
   * Build snowplow configuration
   */
  const spConfig: SnowplowConfig = {
    appId: appId || 'web',
    cookieDomain: '.trello.com',
    respectDoNotTrack: true,
    stateStorageStrategy: 'cookie',
  };

  const isGdprUser = document.cookie.indexOf('gdpr-user=true') !== -1;
  const hasCookieConsent =
    document.cookie.indexOf('gdpr-cookie-consent=accepted') !== -1;

  if (isGdprUser && !hasCookieConsent) {
    spConfig.cookieLifetime = 0;
  }

  /*
   * Initialize snowplow library
   */
  snowplow('newTracker', 'cf', snowplowCloudfrontServer, spConfig);

  /*
   * Set user data
   */
  if (isGdprUser) {
    snowplow('setOptOutCookie', 'opt-out');
  }

  if (memberId) {
    snowplow('setUserId:cf', memberId);
    trackGTMEvent({ isLoggedIn: true });
  } else {
    trackGTMEvent({ isLoggedIn: false });
  }

  trackGTMEvent({ inApp: true });

  /*
   * Set onLoaded callback. This function is called within the context of the
   * Snowplow singleton, so `this` within this function refers to it
   */
  snowplow(function (this: SnowplowInstanceRef) {
    /*
     * domain_userid saved to the global window object here to use in
     * SimpleTest experiments with non-member goals, eg: signups
     */
    const domainUserId = this.cf.getDomainUserId();
    window.domain_userid = domainUserId;

    trackGTMEvent({
      event: 'snowplow.loaded',
      snowplow: {
        domain_userid: domainUserId,
      },
    });
  });
};
