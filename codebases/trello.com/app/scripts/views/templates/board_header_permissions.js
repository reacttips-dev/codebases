// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'board_header_permissions',
);

module.exports = t.renderable(function ({ permIconClass, permText }) {
  t.span({
    class: t.classify({
      'board-header-btn-icon': true,
      'icon-sm': true,
      [`icon-${permIconClass}`]: true,
    }),
  });
  return t.span('.board-header-btn-text', () => t.text(permText));
});
