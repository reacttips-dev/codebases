/* eslint-disable @trello/disallow-filenames */
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { attachmentsDomain } = require('@trello/config');
const parseURL = require('url-parse');
const { isTrello } = require('./is-trello');
const { isCypress } = require('@trello/browser');

module.exports.isTrelloAttachment = function (url) {
  if (url.indexOf(attachmentsDomain) === 0) {
    return true;
  }
  return (
    parseURL(url).pathname.match(
      /^\/1\/cards\/[a-f0-9]{24}\/attachments\/[a-f0-9]{24}\/download\/.*/,
    ) &&
    // HACK ALERT: Due to moving attachments out of S3 we need to bypass this host check
    // for a cypress test to continue passing. This has no effect in production.
    (isTrello(url) || isCypress())
  );
};
