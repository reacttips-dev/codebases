// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'member_on_board_menu',
);
const { dontUpsell } = require('@trello/browser');

module.exports = function () {
  t.li(function () {
    if (t.mustacheVar('canInviteMemberToTeam')) {
      const isFreeTeam = t.mustacheVar('isFreeTeam');
      const link = dontUpsell()
        ? '/business-class'
        : t.mustacheVar('orgBillingUrl');
      if (isFreeTeam) {
        t.div(
          {
            class: 'js-add-to-team pop-over-list-item',
            role: 'button',
            tabIndex: '0',
          },
          function () {
            t.format('add-to-team-as-admin');
            if (!dontUpsell()) {
              return t.div({ class: 'for-more-roles-react-component' });
            } else {
              return t.small('.add-to-team-upgrade-bc', function () {
                if (dontUpsell()) {
                  return t.format('for-more-roles-non-cta', { link });
                } else {
                  return t.format('for-more-roles', { link });
                }
              });
            }
          },
        );
      } else {
        t.a({ class: 'js-add-to-team', href: '#' }, () =>
          t.format('add-to-team'),
        );
      }
    }
    t.mustacheBlock('type', () =>
      t.a(
        {
          class:
            t.mustacheBlock('canChangeRole', () => 'js-change-role') +
            t.mustacheBlockInverted('canChangeRole', () => 'disabled'),
          href: '#',
        },
        () =>
          t.format('change-permissions-ellipsis-type', {
            type: t.mustacheVar('type'),
          }),
      ),
    );
    return t.mustacheBlockInverted('type', () =>
      t.a(
        {
          class:
            t.mustacheBlock('canChangeRole', () => 'js-change-role') +
            t.mustacheBlockInverted('canChangeRole', () => 'disabled'),
          href: '#',
        },
        () => t.format('change-permissions-ellipsis'),
      ),
    );
  });

  if (!t.mustacheVar('isTemplate')) {
    t.li(() =>
      t.a(
        {
          class: 'js-view-member-activity',
          href: t.mustacheVar('boardProfileUrl'),
        },
        () => t.format('view-member-s-board-activity'),
      ),
    );
  }

  t.mustacheBlock('canRemove', () =>
    t.li(() =>
      t.a('.js-remove-member', function () {
        t.mustacheBlock('isMe', () => t.format('leave-board-ellipsis'));
        return t.mustacheBlockInverted('isMe', () =>
          t.format('remove-from-board-ellipsis'),
        );
      }),
    ),
  );

  t.mustacheBlockInverted('canRemove', () =>
    t.mustacheBlock('isMe', () =>
      t.mustacheBlock('isMoreThanOneMember', () =>
        t.mustacheBlock('memberIsAdmin', () =>
          t.li(function () {
            t.hr();
            return t.p('.quiet.u-bottom', () =>
              t.format(
                'you-can-t-leave-because-you-are-the-only-admin-to-make-another-user-an-admin-click-their-avatar-select-change-permissions-ellipsis-and-select-admin',
              ),
            );
          }),
        ),
      ),
    ),
  );

  return t.mustacheBlock('isGhost', () =>
    t.li(function () {
      t.hr();
      return t.p('.quiet.u-bottom', () =>
        t.format(
          'this-user-will-be-able-to-access-this-board-once-they-sign-up-with-trello-and-confirm-their-email-address',
        ),
      );
    }),
  );
};
