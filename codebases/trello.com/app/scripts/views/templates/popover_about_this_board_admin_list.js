// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'popover_about_this_board_admin_list',
);

module.exports = () =>
  t.div('.about-this-board-admin-list-popover', () =>
    t.ul('.js-admin-list', () =>
      t.li('.pop-over-member-list', () => t.span('.name.js-show-all-admins')),
    ),
  );
