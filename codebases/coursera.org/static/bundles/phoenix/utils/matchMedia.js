import inServerContext from 'bundles/ssr/util/inServerContext';
/**
 * Use these functions to test media queries at the same breakpoints used within our styles.
 */

export const SCREEN_XS = 480;
export const SCREEN_SM = 768;
export const SCREEN_MD = 992;
export const SCREEN_LG = 1200;

export const SCREEN_XS_MAX = SCREEN_SM - 1;
export const SCREEN_SM_MAX = SCREEN_MD - 1;
export const SCREEN_MD_MAX = SCREEN_LG - 1;

const matches = function (mediaQueryString) {
  if (inServerContext || typeof window.matchMedia !== 'function') {
    return false;
  }

  const mediaQueryList = window.matchMedia(mediaQueryString);

  return mediaQueryList.matches;
};

const mediaQueryHelpers = {
  isPhoneOrSmaller() {
    return matches('(max-width: ' + SCREEN_XS_MAX + 'px)');
  },

  isTabletOrSmaller() {
    return matches('(max-width: ' + SCREEN_SM_MAX + 'px)');
  },

  isDesktopOrSmaller() {
    return matches('(max-width: ' + SCREEN_MD_MAX + 'px)');
  },

  isPhoneOrBigger() {
    return matches('(min-width: ' + SCREEN_XS + 'px)');
  },

  isTabletOrBigger() {
    return matches('(min-width: ' + SCREEN_SM + 'px)');
  },

  isDesktopOrBigger() {
    return matches('(min-width: ' + SCREEN_MD + 'px)');
  },

  /**
   * @param {String} A height breakpoint in pixels.
   * @returns {bool} True if the viewport is equal to or below the specified height, false otherwise.
   */
  isHeightOrSmaller(height) {
    return matches('(max-height: ' + height + 'px)');
  },

  /**
   * @param {String} A height breakpoint in pixels.
   * @returns {bool} True if the viewport is above than the specified height, false otherwise.
   */
  isAboveHeight(height) {
    return matches('(min-height: ' + (height + 1) + 'px)');
  },
};

export default mediaQueryHelpers;

export const {
  isPhoneOrSmaller,
  isTabletOrSmaller,
  isDesktopOrSmaller,
  isPhoneOrBigger,
  isTabletOrBigger,
  isDesktopOrBigger,
  isHeightOrSmaller,
  isAboveHeight,
} = mediaQueryHelpers;
