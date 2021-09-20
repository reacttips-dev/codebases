// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'board_menu_activity',
);

module.exports = function () {
  t.div('.segmented-control', () => {
    t.a(
      '.segmented-control-item.js-show-all.js-control-option',
      { href: '#' },
      () => {
        return t.format('all');
      },
    );
    return t.a(
      '.segmented-control-item.js-show-comments.js-control-option',
      { href: '#' },
      () => {
        return t.format('comments');
      },
    );
  });

  t.div('.phenom-list.js-list-activity');

  return t.a('.show-more.js-more-actions', { href: '#' }, () => {
    return t.format('load-more-activity');
  });
};
