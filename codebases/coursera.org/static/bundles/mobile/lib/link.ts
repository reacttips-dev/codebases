import { deepLinkablePages } from 'bundles/mobile/common/constants';
import config from 'js/app/config';
import _ from 'underscore';

const ANDROID_APP_ID = 'org.coursera.android';
const ANDROID_STORE_BASE_URL = 'http://play.google.com/store/apps/details?id=';
const ANDROID_STORE_BASE_URL_CHINA = 'http://android.myapp.com/myapp/detail.htm?apkName=';

const STORE_URL = {
  // REF https://linkmaker.itunes.apple.com/us/
  ios: 'https://itunes.apple.com/app/apple-store/id736535961?pt=2334150&ct=Coursera%20Web%20Promo%20Banner&mt=8',

  // REF http://developer.android.com/distribute/tools/promote/linking.html
  android: ANDROID_STORE_BASE_URL + ANDROID_APP_ID,
  androidChina: ANDROID_STORE_BASE_URL_CHINA + ANDROID_APP_ID,
};

// @ts-expect-error ts-migrate(2339) FIXME: Property 'country' does not exist on type 'JsAppCo... Remove this comment to see the full error message
function shouldAvoidGooglePlay(requestCountryCode = config.country) {
  // Google Play is blocked in China
  return requestCountryCode === 'CN';
}

// @ts-expect-error ts-migrate(2339) FIXME: Property 'country' does not exist on type 'JsAppCo... Remove this comment to see the full error message
function storeForAgent(userAgent, requestCountryCode = config.country) {
  if (!userAgent) {
    return null;
  }

  if (userAgent.isIOS) {
    return 'ios';
  } else if (userAgent.isAndroid) {
    if (shouldAvoidGooglePlay(requestCountryCode)) {
      return 'androidChina';
    } else {
      return 'android';
    }
  }
}

// @ts-expect-error ts-migrate(2339) FIXME: Property 'country' does not exist on type 'JsAppCo... Remove this comment to see the full error message
function getAppUrl(userAgent, urlPath = '/browse', requestCountryCode = config.country) {
  if (!userAgent) {
    return null;
  }

  const storeType = storeForAgent(userAgent, requestCountryCode);
  if (!storeType) {
    return null;
  }

  if (storeType === 'ios') {
    return STORE_URL[storeType];
  }

  const matchedPage = _(deepLinkablePages).find((pageConfig) => pageConfig.pattern.test(urlPath));
  const androidPath = matchedPage ? matchedPage.webToMobilePathTranslator(urlPath) : '/browse';

  if (storeType === 'androidChina') {
    const encodedPlayStoreUrl = encodeURIComponent(STORE_URL[storeType]);
    return `intent:coursera-mobile://app${androidPath}#Intent;package=org.coursera.android;S.browser_fallback_url=${encodedPlayStoreUrl};end;`;
  } else {
    return `intent:coursera-mobile://app${androidPath}#Intent;package=org.coursera.android;end;`;
  }
}

const exported = {
  shouldAvoidGooglePlay,
  storeForAgent,
  storeUrls: STORE_URL,

  // FROM https://docs.google.com/a/coursera.org/document/d/1Rg-Km5A5tN2wzhv-pv3gKIB2gvghm8goX3UcUHOhR7s/edit
  getAppUrl,
};

export default exported;
export { shouldAvoidGooglePlay, storeForAgent, STORE_URL as storeUrls, getAppUrl };
