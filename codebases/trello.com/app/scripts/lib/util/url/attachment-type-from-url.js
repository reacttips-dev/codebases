/* eslint-disable @trello/disallow-filenames */
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { isTrello } = require('app/scripts/lib/util/url/is-trello');

module.exports.attachmentTypeFromUrl = function (url) {
  switch (false) {
    case !isTrello(url):
      return 'trello';
    case !new RegExp(`docs\\.google\\.com/`, 'i').test(url) &&
      !new RegExp(`drive\\.google\\.com/`, 'i').test(url):
      return 'google-drive';
    case !new RegExp(`dropbox\\.com/`, 'i').test(url):
      return 'dropbox';
    case !new RegExp(`onedrive\\.live\\.com/`, 'i').test(url) &&
      !new RegExp(`1drv\\.ms/`, 'i').test(url) &&
      !new RegExp(`sharepoint\\.com/`, 'i').test(url):
      return 'onedrive';
    case !new RegExp(`app\\.box\\.com/`, 'i').test(url):
      return 'box';
    default:
      return 'link';
  }
};
