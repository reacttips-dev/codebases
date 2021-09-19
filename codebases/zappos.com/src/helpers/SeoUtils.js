import { SEO_URL_RE } from 'common/regex';

/**
 * Convert an SEO term, possibly from a fragment of an SEO url, to a human term.
 * @param  {string} term - seo term to humanize
 * @return {string}
 */
export const seoTermToHumanTerm = term => term.replace(/-+/g, ' ');

/**
 * Convert a term to its SEO-styled counterpart fit for an SEO url
 * @param  {string} term Search term to convert
 * @return {string}
 */
export const termToSeoPath = term => decodeURIComponent(term)
  .replace(/([^A-Z0-9]|\s+)/gi, '-')
  .replace(/-+/g, '-')
  .replace(/-*$/, '')
  .replace(/^-*/, '/')
  .toLowerCase();

/**
 * Returns true if the url looks like and SEO url
 *
 * @param {string} url
 */
export const looksLikeSeoUrl = url => SEO_URL_RE.test(url);

/**
 * Given a /search url which only has a `t` or `term` query string param,
 * return an SEO friendly url. This duplicates the logic from ZFC.
 * https://github01.zappos.net/Integ/zfc/blob/81e8f23df7a91c6e6b26a45c1bbb21de4a63d65b/libzfc/seo.c
 * @param  {string} searchQueryUrl - query string of the search
 * @return {string} SEO friendly search url
 */
export const zfcSeoRewriteSearchQuery = (searchQueryUrl = '') => {
  if (/^\/search\/?\?t(?:erm)?=\s*$/.test(decodeURIComponent(searchQueryUrl))) {
    return '/search?term=';
  }

  return searchQueryUrl.replace(/\/search\/?\?t(?:erm)?=([^&]+)(&)?/, (match, term, hasAmp) => `${termToSeoPath(term)}${hasAmp ? '?' : ''}`);
};
