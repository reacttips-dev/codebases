// TODO(bryan): figure out how to load SVGs in webpack
import rebrandLogoSvg from 'bundles/page/assets/rebrandLogoSvg';

import logger from 'js/app/loggerSingleton';

const FILL_REGEXP = /fill="(#[a-f0-9]+)"/;
const FILL_REGEXP_GLOBAL = /fill="(#[A-Fa-f0-9]+)"/g;
const DEFAULT_HEX_COLOR_CODE = FILL_REGEXP.exec(rebrandLogoSvg)?.[1];

// REF http://stackoverflow.com/questions/23097928/node-js-btoa-is-not-defined-error
export const encode = (svg: string): string => {
  if (typeof window !== 'undefined' && typeof window.btoa === 'function') {
    return window.btoa(svg);
  } else if (typeof Buffer !== 'undefined') {
    return Buffer.from(svg).toString('base64');
  } else {
    logger.error('Cannot find base64 encoding function available for the logo');
    return '';
  }
};

/**
 * @param  {String} [hexColorCode]
 * @return {String} base64 encoding of the logo
 */

export const getBase64 = (hexColorCode: string, svgLogo?: string): string => {
  const changeColor = hexColorCode && hexColorCode !== DEFAULT_HEX_COLOR_CODE;
  const logoSvg = svgLogo || rebrandLogoSvg;
  let svg = changeColor ? logoSvg.replace(FILL_REGEXP_GLOBAL, `fill="${hexColorCode}"`) : logoSvg;

  if (svgLogo) {
    // match any a-z or 0-9 case insensitive character inside of fill="" with an optional # at the beginning
    // allows us to catch fill="none"` or `fill="purple", for instance
    const EXPANSIVE_FILL_REGEXP_GLOBAL = /fill="(#?[a-z0-9]+)"/gi;
    svg = logoSvg.replace(EXPANSIVE_FILL_REGEXP_GLOBAL, `fill="${hexColorCode}"`);
  }

  return encode(svg);
};

export default { getBase64 };
