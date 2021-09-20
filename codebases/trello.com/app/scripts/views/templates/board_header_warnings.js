// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'board_header_warnings',
);

module.exports = t.renderable(function ({ canDismiss, warning }) {
  const { key, dismiss } = warning;
  return t.div('.board-warning', function () {
    t.format(key);
    if (canDismiss) {
      return t.span(
        '.js-dismiss-warning.board-warning-close.icon-sm.icon-close',
        { 'data-dismiss': dismiss },
      );
    }
  });
});
