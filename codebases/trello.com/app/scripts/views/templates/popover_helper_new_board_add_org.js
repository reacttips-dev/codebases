// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'popover_helper_new_board_add_org',
);

module.exports = function () {
  t.p(() =>
    t.format(
      'an-organization-is-a-collection-of-members-and-boards-they-make-sharing-and-working-within-a-group-even-easier',
    ),
  );

  return t.a('.button.js-create-org', { href: '#' }, () =>
    t.format('create-an-organization'),
  );
};
