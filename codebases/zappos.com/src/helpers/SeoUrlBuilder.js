import { makeAscii } from 'helpers';
import ProductUtils from 'helpers/ProductUtils';

const SEO_FRIENDLY_TRANSLATION_MAP =
            '@@@@@@@@@-----@@@@@@@@@@@@@@@@@@-------@--------0123456789------' +
             '-abcdefghijklmnopqrstuvwxyz------abcdefghijklmnopqrstuvwxyz----@' +
             '----------------------------------------------------@---@-------' +
             'aaaaaa-ceeeeiiii-nooooo-ouuuuy--aaaaaa-ceeeeiiii-nooooo-ouuuuy-y' +
             'aaaaaaccccccccddddeeeeeeeeeegggggggghhhhiiiiiiiiii@@jjkkklllllll' +
             'lllnnnnnnnnnoooooo@@rrrrrrssssssssttttttuuuuuuuuuuuuwwyyyzzzzzzs';
const EXTRA_DASH_CHARS = {
  '\u2010': true,
  '\u2011': true,
  '\u2012': true,
  '\u2013': true,
  '\u2014': true,
  '\u2015': true,
  '\u201C': true,
  '\u201D': true,
  '\u2022': true
};

export function buildSeoProductString(product, colorId) {
  let seoString = null;
  const { brandName, productName, styles } = product;
  if (brandName && productName) {
    seoString = `${rewriteSeoPart(brandName)}-${rewriteSeoPart(productName)}`;
    seoString += buildColorPart(styles, colorId);
  }

  return seoString;
}

export function buildSeoProductUrl(product, colorId) {
  return `/p/${buildSeoProductString(product, colorId)}/product/${product.productId}${colorId ? `/color/${colorId}` : ''}`;
}

export function buildSeoBrandString(brandName, brandId) {
  return `/b/${rewriteSeoPart(makeAscii(brandName))}/brand/${brandId}`;
}

function rewriteSeoPart(input) {
  let output = '';
  let candidate = '@';
  let lastChar = '-';
  for (const char of input) {
    const charCode = char.charCodeAt(0);
    if (charCode < SEO_FRIENDLY_TRANSLATION_MAP.length) {
      candidate = SEO_FRIENDLY_TRANSLATION_MAP[charCode];
    } else if (char in EXTRA_DASH_CHARS) {
      candidate = '-';
    } else {
      candidate = '@';
    }

    if (candidate !== '@') {
      // don't allow consecutive dashes
      if ((lastChar === '-' && candidate !== '-') || lastChar !== '-') {
        output += candidate;
      }
      lastChar = candidate;
    }
  }
  return trimTrailingDash(output);
}

function trimTrailingDash(input) {
  if (input[input.length - 1] === '-') {
    return input.substring(0, input.length - 1);
  }
  return input;
}

function buildColorPart(styles, colorId) {
  let colorPart = '';
  if (styles && colorId) {
    const style = ProductUtils.getStyleByColor(styles, colorId);
    if (style && style.color) {
      colorPart = `-${rewriteSeoPart(style.color)}`;
    }
  }
  return colorPart;
}
