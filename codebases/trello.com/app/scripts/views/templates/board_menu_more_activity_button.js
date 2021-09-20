// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'board_menu_more_activity_button',
);

module.exports = function () {
  t.mustacheBlockInverted('hasCount', () => {
    return t.format('view-all-activity-ellipsis');
  });

  return t.mustacheBlock('hasCount', () => {
    return t.format('view-all-unread-activity-count-ellipsis', {
      count: t.mustacheVar('count'),
    });
  });
};
