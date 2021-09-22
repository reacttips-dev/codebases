/**
 * Converts provided locale code to be standardized based on
 * https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang
 */
export const getStandardizedLocale = (locale: string): string =>
  locale.toLowerCase().replace(/_/g, '-');

/**
 * Strip region subtag if present in the locale
 */
export const getLocaleWithoutRegion = (locale: string): string =>
  getStandardizedLocale(locale).replace(/-[a-z]*/g, '');
