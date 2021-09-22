import UserAgentInfo from 'js/lib/useragent';

// This is bundled into preloader which we must keep small, so use parseUri
// instead of jsuri because it's much smaller gzipped (653 B < 3335 B)
import parseUri from 'js/vendor/parseuri.v1-2-2';

import userAgentOverride from 'js/constants/userAgentOverride';

const agentString =
  typeof navigator === 'undefined'
    ? 'Prerender' // rendering isomorphic inside Node, can treat as prerender.io
    : navigator.userAgent; // in browser, use its agent string

// NOTE if you Object.freeze() this, some tests will break because they need to modify the singleton
const userAgent = new UserAgentInfo(agentString);
/**
 * Get the params from coursera.org/*?testUserAgentOverride={ios,android}
 *
 * This is to enable simulation of iOS or Android platforms during Selenium testing.
 *
 * @return {String} 'ios', 'android' or null
 */
function getTestPlatformOverride() {
  // NOTE only works through client-side execution
  if (typeof window === 'undefined') return null;

  const uri = parseUri(window.location.href);
  return uri.queryKey[userAgentOverride.paramName];
}

// allow override by query params
const override = getTestPlatformOverride();

userAgent.isAndroid = userAgent.isAndroid || override === userAgentOverride.paramValues.android;
userAgent.isIOS = userAgent.isIOS || override === userAgentOverride.paramValues.ios;
userAgent.isMobile = userAgent.isMobile || userAgent.isAndroid || userAgent.isIOS;

export default userAgent;
