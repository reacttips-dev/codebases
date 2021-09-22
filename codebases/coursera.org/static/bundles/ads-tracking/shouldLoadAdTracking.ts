import requestCountryCode from 'bundles/phoenix/template/models/requestCountryCode';

const PUPPETEER_AGENT = 'HeadlessChrome';

export default function shouldLoadAdTracking(): boolean {
  if (requestCountryCode === 'CN') return false;

  const disallowedTrackerPaths = [
    // preventing ad tracking on Course Home, but
    // be CAREFUL not to accidentally prevent ad tracking on CDP /learn/:slug/ urls
    // be CAREFUL not to accidentally prevent ad tracking on VLP /learn/:slug/lecture/ urls
    // be CAREFUL not to accidentally prevent ad tracking on CDP reviews /learn/:slug/reviews urls
    // please add comprehensive unit tests in adTrackingTests
    // (?!aaa) syntax is a negative lookahead
    /^\/learn\/[^/]+\/(?!lecture)(?!reviews).+/,
    /^\/reset\/confirm/,
    /^\/account-profile\/?/,
    /^\/account-settings\/?/,
    /^\/admin\/?$/,
    /^\/admin\/[^/]+/,
    /^\/internal\/?$/,
    /^\/internal\/[^/]+/,
    /^\/o\/[^/]+\/admin/,
    /^\/onboarding/,
    /^\/teach-partner\//,
    /^\/teach-specialization\//,
    /^\/teach\//,
    /^\/user-onboarding/,
  ];

  if (typeof window !== 'undefined') {
    if (window.navigator.userAgent.includes(PUPPETEER_AGENT)) return false;
    return !disallowedTrackerPaths.some((a) => a.test(window.location.pathname));
  }

  return true;
}
