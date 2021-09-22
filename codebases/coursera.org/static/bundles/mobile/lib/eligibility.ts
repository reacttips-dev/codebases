import Cookie from 'js/lib/cookie';

const DISMISS_PERSIST_COOKIE = 'mobile-promo-dismissed';
const DISMISS_PERSIST_DAYS = 1;

const FORCE_DISMISS_MOBILE_PROMO_PARAM = 'hide_mobile_promo';
const FORCE_SHOW_MOBILE_PROMO_PARAM = 'show_mobile_promo';

// mobile promo wall only appears for pages with these basenames
const WHITELISTED_PATHNAME_REGEXPS = [
  /^\/$/,
  /^\/recommendations$/,
  /^\/courses$/,
  /^\/search$/,
  /^\/browse$/,
  /^\/browse\/([^\/])+$/,
  /^\/specializations$/,
  /^\/(course|learn)\/([^\/])+$/,
  /^\/specializations\/([^\/])+$/,
  /^\/specializations2016\/([^\/])+$/,
  /^\/programs\/([^\/])+$/,
  /^\/ssr/, // for testing
];

function deferPromotion() {
  Cookie.set(DISMISS_PERSIST_COOKIE, true, {
    expires: DISMISS_PERSIST_DAYS,
    path: '/',
  });
}

// REF https://docs.google.com/a/coursera.org/document/d/1eAgO5gFeQHIYFggJi5hBZINxfXPcpPMw326R8emiipM/
function isFreshMobile(userAgent: $TSFixMe, cookies: $TSFixMe) {
  if (!userAgent) return false;

  let dismissedRecently = false; // in the absence of cookie access, assume not

  if (cookies || Cookie) {
    const dismissalCookie = cookies ? cookies[DISMISS_PERSIST_COOKIE] : Cookie.get(DISMISS_PERSIST_COOKIE); // global, breaks in SSR

    dismissedRecently = dismissalCookie === 'true';
  }

  const isSupportedMobileDevice = userAgent.isIOS || userAgent.isAndroid;
  return !dismissedRecently && !userAgent.isCourseraMobileApp && isSupportedMobileDevice;
}

function isWhitelistedUrl(path: $TSFixMe) {
  return !!WHITELISTED_PATHNAME_REGEXPS.find((regex) => regex.test(path));
}

const exported = {
  deferPromotion,
  isFreshMobile,
  isWhitelistedUrl,
  FORCE_DISMISS_MOBILE_PROMO_PARAM,
  FORCE_SHOW_MOBILE_PROMO_PARAM,
};

export default exported;
export {
  deferPromotion,
  isFreshMobile,
  isWhitelistedUrl,
  FORCE_DISMISS_MOBILE_PROMO_PARAM,
  FORCE_SHOW_MOBILE_PROMO_PARAM,
};
