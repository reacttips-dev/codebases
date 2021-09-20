// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'board_copy_vis',
);

module.exports = function () {
  t.format('this-board-will-be-visdisplaytext', {
    visIconClass: t.mustacheVar('visIconClass'),
    visDisplayText: t.mustacheVar('visDisplayText'),
  });
  t.text(' ');
  return t.a('.js-change-vis', { href: '#' }, () => t.format('change'));
};
