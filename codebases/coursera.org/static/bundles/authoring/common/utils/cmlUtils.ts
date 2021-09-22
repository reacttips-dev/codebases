import _ from 'underscore';
import punycode from 'punycode';
import epicClient from 'bundles/epic/client';

const DOMAIN_NAME_REGEXP = /^([^:/?#]+:)?\/\/([^/?#]*)/;

/**
 * Replaces unicode symbols in URL domain to punycode.
 * For example http://cöursera.org transforms to http://xn--cursera-90a.org/
 * https://en.wikipedia.org/wiki/Internationalized_domain_name
 * @param  {string} URL to punycodify
 * @return {string} URL with replaced symbols
 */
export const punycodeDomain = (url: string): string => {
  return url.replace(DOMAIN_NAME_REGEXP, (m, protocol = '', domain) => `${protocol}//${punycode.toASCII(domain)}`);
};

/**
 * Sanitize URL to prevent XSS
 * @param  {string} url URL to sanitize
 * @return {string} Sanitized URL
 */
export const sanitizeURL = (url: string): string => {
  let sanitizedURL = url;

  // Prevent javascript: and data: prefixes
  if (/^javascript:/i.test(sanitizedURL) || /^data:/i.test(sanitizedURL)) {
    sanitizedURL = '';
  }

  // Escape HTML entities
  sanitizedURL = _(sanitizedURL).escape();

  // Convert punycode to ASCII
  sanitizedURL = punycodeDomain(sanitizedURL);

  return sanitizedURL;
};
