/* eslint-disable
    eqeqeq,
    @trello/disallow-filenames,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { Auth } = require('app/scripts/db/auth');
const { ModelCache } = require('app/scripts/db/model-cache');
const { isMeAlias } = require('./isMeAlias');
const { siteDomain } = require('@trello/config');

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}

module.exports.isWebClientPage = function (url) {
  let possibleName;
  if (url.indexOf('/') !== 0 && url.indexOf(siteDomain + '/') !== 0) {
    return false;
  }

  url = url
    .replace(new RegExp(`^${siteDomain}`), '')
    .replace(new RegExp(`^/(?=.)`), '');

  // Drop the query or hash; those don't factor into whether a page is a
  // web client page or not
  url = url.replace(new RegExp(`[\\?\\#].*$`), '');

  if (new RegExp(`\\.[a-z]+$`, 'i').test(url)) {
    // client never handles any pages with extensions; probably an export
    return false;
  }

  if (new RegExp(`^([bce]|board|card|org)/`).test(url)) {
    // client serves board and card pages
    return true;
  }

  if (new RegExp(`^search(/|$)`).test(url)) {
    // client serves any searches
    return true;
  }

  if (Auth.isLoggedIn()) {
    if (new RegExp(`^${Auth.myUsername()}(/|$)`).test(url)) {
      // client serves member pages
      return true;
    }
    if (url === '/') {
      // client serves the logged-in landing page (the boards page)
      return true;
    }
  }

  if (new RegExp(`^shortcuts(?:/overlay)?/?$`).test(url)) {
    return true;
  }
  if (new RegExp(`^create-first-board(/|$)`).test(url)) {
    return true;
  }

  // It might still be /username or /orgname ... or it might be a new
  // meta page like /awesome
  //
  // There's really no way to know, so check and see if we know about any
  // members or clients that have names matching the current route

  if (
    (possibleName = __guard__(
      new RegExp(`^[^/\\?\\#]+`).exec(url),
      (x) => x[0],
    )) != null
  ) {
    // Handle aliases; it's unlikely that we'd actually have any links to these
    // but let's handle them just in case
    if (Auth.isLoggedIn() && isMeAlias(possibleName)) {
      return true;
    }

    if (/^[a-z0-9_]{3,}$/.test(possibleName)) {
      if (ModelCache.some('Member', 'username', possibleName)) {
        return true;
      }
      if (ModelCache.some('Organization', 'name', possibleName)) {
        return true;
      }
    }
  }

  return false;
};
