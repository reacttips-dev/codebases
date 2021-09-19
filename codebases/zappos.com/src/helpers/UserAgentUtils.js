const isAndroid = ua => /android/i.test(ua);
const isAndroidMobile = ua => /android.*mobile/i.test(ua);
const isIPad = ua => /ipad/i.test(ua);
const isIPhone = ua => /iphone/i.test(ua);
const isSupportedBlackBerryMobile = ua => /BB10.+Mobile/i.test(ua);

const SUPPORTED_MOBILE_DEVICES = [isAndroidMobile, isIPhone, isSupportedBlackBerryMobile];

/**
 * Returns boolean if is mobile device based on user agent
 * @param  {string} ua
 * @return {boolean}
 */
export const isSupportedMobileDevice = ua => SUPPORTED_MOBILE_DEVICES.some(isSupported => isSupported(ua));

/*
  Returns one of ['android', 'iphone', 'ipad', undefined] given a user agent
  string.
*/
export function userAgentStringToPlatform(userAgent) {
  userAgent = userAgent || (typeof navigator === 'undefined' ? '' : navigator.userAgent);
  if (isAndroid(userAgent)) {
    return 'android';
  } else if (isIPhone(userAgent)) {
    return 'iphone';
  } else if (isIPad(userAgent)) {
    return 'ipad';
  }
}
