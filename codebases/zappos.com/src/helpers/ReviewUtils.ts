import { logError } from 'middleware/logger';

/**
 * accepts a path starting with /product/review/<sku> and returns the same path
 * except with a /page/1 parameter. at the time of writing, this is used for
 * redirecting /page/0 to /page/1.
 */
export const makePageOneUrl = (() => {
  const pagePattern = /\/page\/\d+/;
  const beforePagePattern = /\/product\/review\/\d+/;
  return (path: string) => {
    if (pagePattern.test(path)) {
      return path.replace(pagePattern, '/page/1');
    }
    const match = path.match(beforePagePattern);
    if (match) {
      const pathBeforePage = match[0];
      const indexOfPathAfterPage = pathBeforePage.length;
      const pathAfterPage = path.slice(indexOfPathAfterPage);
      return pathBeforePage + '/page/1' + pathAfterPage;
    }
    throw new Error('argument must begin with /product/review/<sku> (where <sku> is a the actual SKU of a product)');
  };
})();

/**
 * Gets the URL to redirect to upon successful authentication for the write review page.
 * @param {String} productId
 * @param {String} colorId
 * @param {String} isPremier treated as a true/false whether the review form should be treated as premier.
 */
export function getWriteReviewReturnUrl(productId: string, colorId?: string, isPremier?: boolean) {
  return `/product/review${isPremier ? '/p' : ''}/add/${productId}${colorId ? `/color/${colorId}` : ''}`;
}

/** A helper that says if we should we render this gallery data */
export const shouldRenderReviewGallery = ({ mediaCount = 0 } = {}) => mediaCount > 0;

export const valueFromFitSurveyText = (() => {
  const mapping: Record<string, number | null> = {
    'felt a full size larger than marked': 5,
    'felt a half size larger than marked': 4,
    'felt true to size': 3,
    'felt a half size smaller than marked': 2,
    'felt a full size smaller than marked': 1,

    'felt wider than marked': 5,
    'felt true to width': 3,
    'felt narrower than marked': 1,

    'excellent arch support': 5,
    'moderate arch support': 3,
    'no arch support': 1,

    '':  null
  };

  return (text = '') => {
    const ret = mapping[text.toLowerCase()];
    if (typeof ret === 'undefined') {
      logError(`unhandled fit survey response text: "${text}"`);
      return null;
    }
    return ret;
  };
})();
