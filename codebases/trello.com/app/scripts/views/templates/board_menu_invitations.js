// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'board_menu_invitations',
);

module.exports = function () {
  t.li(() =>
    t.a('.js-select', { href: '#', name: 'admins' }, function () {
      t.check(t.mustacheVar('invitations_admins'), 'admins');
      return t.span('.sub-name', () =>
        t.format('allow-only-admins-to-add-and-remove-others'),
      );
    }),
  );

  return t.li(() =>
    t.a('.js-select', { href: '#', name: 'members' }, function () {
      t.check(t.mustacheVar('invitations_members'), 'all-members');
      return t.span('.sub-name', () =>
        t.format('allow-members-and-admins-to-add-and-remove-others'),
      );
    }),
  );
};
