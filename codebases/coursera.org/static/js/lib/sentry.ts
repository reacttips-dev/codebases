/* global coursera */
import user from 'js/lib/user';
import config from 'js/app/config';
import type { JsAppConfig } from 'js/app/config';
import cookie from 'js/lib/cookie';

import loadRaven from 'lazy!raven-js'; // eslint-disable-line import/extensions

const EN_LOCALE = 'en';
const PROD_ASSET_ROOT = 'https://d3njjcbhbojbot.cloudfront.net';

declare global {
  const SENTRY_SAMPLE_RATE: number;

  const coursera: { config: JsAppConfig } | undefined;

  interface Window {
    locale?: string;
  }
}

export const getShouldLoadRaven = (): boolean => {
  // Rapidos build version injected via EDGE
  if (typeof coursera !== 'undefined') {
    const buildVersion = coursera.config && coursera.config.version;
    // verify that both the environment and build are for production. buildVersion will be a hash when it's a production build, and will list the diff number if its for a staging link
    const isProduction = config.environment === 'production' && !buildVersion?.startsWith('phabricator/diff');
    return !!(typeof window !== 'undefined' && isProduction && window.locale === EN_LOCALE && buildVersion);
  }

  return false;
};

export default (sentryPublicDsn: string) => {
  if (getShouldLoadRaven()) {
    loadRaven((raven) => {
      let sentrySampleRate;
      const buildVersion = coursera?.config && coursera.config.version;

      if (cookie.get('forceSentry')) {
        sentrySampleRate = 1.0; // send all events
      } else {
        /* global SENTRY_SAMPLE_RATE */
        // This is configurable via this application's `package.json`
        sentrySampleRate = SENTRY_SAMPLE_RATE;
      }

      const ravenInstance = raven.config(sentryPublicDsn, {
        release: buildVersion,
        whitelistUrls: [new RegExp('^webpack://'), new RegExp(`^${PROD_ASSET_ROOT}`)],
        // This is configurable via this application's `package.json`
        sampleRate: sentrySampleRate,
        ignoreErrors: [
          // Email link Microsoft Outlook crawler compatibility error
          // https://github.com/getsentry/sentry-javascript/issues/3440
          'Object Not Found Matching Id:',
        ],
      });

      if (user.get().authenticated) {
        ravenInstance.setUserContext({
          id: user.get().external_id,
          isSuperuser: user.isSuperuser(),
        });
      }

      ravenInstance.install();
    });
  }
};
