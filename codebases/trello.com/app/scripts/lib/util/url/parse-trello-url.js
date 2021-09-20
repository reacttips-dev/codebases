/* eslint-disable @trello/disallow-filenames */
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { isTrello } = require('./is-trello');
const parseURL = require('url-parse');

module.exports.parseTrelloUrl = function (url) {
  if (!isTrello(url)) {
    return { type: 'unknown' };
  }

  const parsed = parseURL(url);
  // eslint-disable-next-line prefer-const
  let [identifier, shortLink] = Array.from(parsed.pathname.split('/').slice(1));

  const type = (() => {
    switch (identifier) {
      case 'b':
        return 'board';
      case 'c':
        return 'card';
      case 'e':
        return 'enterprise';
      default:
        return 'unknown';
    }
  })();

  shortLink = ['card', 'board'].includes(type) ? shortLink : undefined;

  return {
    type,
    shortLink,
  };
};
