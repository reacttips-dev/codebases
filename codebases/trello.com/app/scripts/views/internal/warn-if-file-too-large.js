/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const Alerts = require('app/scripts/views/lib/alerts');
const { Auth } = require('app/scripts/db/auth');
const _ = require('underscore');

const showFileSizeError = function (board) {
  const memberHasLargeAttachments = Auth.me().hasPremiumFeature(
    'largeAttachments',
  );

  const org = board.getOrganization();
  const orgHasLargeAttachments =
    org?.hasPremiumFeature('largeAttachments') || false;

  const message =
    memberHasLargeAttachments || orgHasLargeAttachments
      ? 'file size exceeds 250mb'
      : 'file size exceeds 10mb';

  return Alerts.show(message, 'error', 'upload', 5000);
};

module.exports = function (board, files) {
  if (!_.isArray(files)) {
    files = [files];
  }

  const org = board.getOrganization();
  for (const file of Array.from(files)) {
    if (!Auth.me().canUploadAttachment(file, org)) {
      showFileSizeError(board);
      return true;
    }
  }

  return false;
};
