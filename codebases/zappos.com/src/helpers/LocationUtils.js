import { createMemoryHistory } from 'history';

import { ABSOLUTE_URL_RE } from 'common/regex';
// need this so that we can just reuse the createLocation logic for parsing string path to pathname + query
const fakeHistory = createMemoryHistory('/');

/**
 * Given a relative string URL, returns a Location object with pathname and search fields parsed.
 * @param  {String} path a relative url
 * @return {Location}      object with pathname and search fields parsed from input.
 */
export function parsePath(path) {
  // not sure why this isn't just exposed in general...
  return fakeHistory.createLocation(path);
}

/**
 * Given an absolute URL, return the relative portion of it.
 * @param  {String} url absolute url
 * @return {String}     relative portion of url.
 */
export function relativizeUrl(url) {
  const matches = ABSOLUTE_URL_RE.exec(url);
  if (matches) {
    const relativeUrl = url.substring(matches.index + matches[0].length);
    return relativeUrl === '' ? '/' : relativeUrl;
  } else {
    return url;
  }
}

export const toRelativeUrlString = location => `${location.pathname}${location.search}${location.hash}`;
