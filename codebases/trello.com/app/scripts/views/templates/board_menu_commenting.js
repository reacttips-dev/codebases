// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'board_menu_commenting',
);

module.exports = function () {
  t.li(() =>
    t.a('.js-select', { href: '#', name: 'disabled' }, function () {
      t.check(t.mustacheVar('comments_disabled'), 'disabled');
      return t.span('.sub-name', () =>
        t.format('no-one-is-allowed-to-comment'),
      );
    }),
  );

  t.li(() =>
    t.a('.js-select', { href: '#', name: 'members' }, function () {
      t.check(t.mustacheVar('comments_members'), 'members');
      return t.span('.sub-name', () =>
        t.format('allow-admins-and-normal-members-to-comment'),
      );
    }),
  );

  t.li(() =>
    t.a(
      {
        href: '#',
        class: `js-select${t.mustacheBlockInverted(
          'comments_showObservers',
          () => ' disabled',
        )}`,
        name: 'observers',
      },
      function () {
        t.check(t.mustacheVar('comments_observers'), 'members-and-observers');
        return t.span('.sub-name', () =>
          t.format('allow-admins-normal-members-and-observers-to-comment'),
        );
      },
    ),
  );

  t.li(() =>
    t.a(
      {
        href: '#',
        class: `js-select${t.mustacheBlockInverted(
          'orgCanSee',
          () => ' disabled',
        )}`,
        name: 'org',
      },
      function () {
        t.check(t.mustacheVar('comments_org'), 'organization-members');
        return t.span('.sub-name', () =>
          t.format(
            'allow-admins-normal-members-observers-and-organization-members-to-comment',
          ),
        );
      },
    ),
  );

  return t.li(() =>
    t.a(
      {
        href: '#',
        class: `js-select${t.mustacheBlockInverted(
          'permissionLevel_public',
          () => ' disabled',
        )}`,
        name: 'public',
      },
      function () {
        t.check(t.mustacheVar('comments_public'), 'any-trello-user');
        return t.span('.sub-name', () =>
          t.format('allow-any-trello-member-to-comment'),
        );
      },
    ),
  );
};
