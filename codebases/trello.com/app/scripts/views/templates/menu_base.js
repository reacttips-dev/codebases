// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'menu_base',
);

module.exports = () =>
  t.ul('.pop-over-list', function () {
    t.li(() => t.ul('.boards-pop-over-list'));
    return t.raw(t.mustacheVar('content'));
  });
