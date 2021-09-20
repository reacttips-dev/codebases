// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'sticker_pack_selection_list',
);

module.exports = function () {
  t.h2(() => t.text(t.mustacheVar('displayName')));

  return t.div('.sticker-list.u-clearfix.js-sticker-list.u-relative');
};
