// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'popover_board_header_all_members',
);

module.exports = t.renderable(function (data, visibleMembers) {
  const memberSections = [
    { key: 'members', jsClass: 'js-list-members' },
    { key: 'team-members', jsClass: 'js-list-team-members' },
    { key: 'recently-joined', jsClass: 'js-list-recently-joined-members' },
    { key: 'invited', jsClass: 'js-list-invited-members' },
    { key: 'guests', jsClass: 'js-list-guests' },
    { key: 'observers', jsClass: 'js-list-observers' },
    { key: 'deactivated', jsClass: 'js-deactivated-members' },
  ];

  t.div('.board-header-popover.js-all-members', function () {
    t.div('.org-members-actions-search');
    return t.div('.board-members-search-container', () =>
      t.input(
        '.board-members-search.js-search-board-member.js-autofocus.js-heading',
        {
          type: 'text',
          placeholder: t.l('search-board-members'),
        },
      ),
    );
  });

  t.div('.board-header-popover.js-all-members', () =>
    (() => {
      const result = [];
      for (const { key, jsClass } of Array.from(memberSections)) {
        result.push(
          t.div(`.board-menu-member-section.${jsClass}`, function () {
            t.div('.board-menu-member-section-header.js-heading', () =>
              t.format(key),
            );

            return t.div('.u-clearfix.js-list', {
              class: t.classify({
                'js-list-draggable-board-members': data.canAssign,
              }),
            });
          }),
        );
      }
      return result;
    })(),
  );

  return t.div('.js-invite-no-results.hide', () =>
    t.p('.board-member-no-results.empty', function () {
      if (!visibleMembers) {
        t.format('not-a-member');
        if (data.showInviteLink) {
          return t.a(
            '.invite-to-board-link.js-invite-to-board-link',
            { href: '#', target: '_blank' },
            () => t.format('invite-to-board'),
          );
        }
      } else {
        return t.format('no-results');
      }
    }),
  );
});
