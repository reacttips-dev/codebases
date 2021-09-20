// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'popover_select_members',
);

module.exports = t.renderable(function ({
  canInviteMembers,
  includeOrgMembers,
}) {
  const memberSection = function (headingKey) {
    t.h4(() => t.format(headingKey));

    t.div('.js-loading', () =>
      t.p('.empty', { style: 'padding: 24px 6px' }, () => t.format('loading')),
    );

    t.div('.js-no-results.hide', () =>
      t.p('.empty', { style: 'padding: 24px 6px' }, () =>
        t.format('no-results'),
      ),
    );

    return t.ul('.pop-over-member-list.checkable.u-clearfix.js-mem-list');
  };

  t.input('.js-search-mem.js-autofocus', {
    type: 'text',
    placeholder: t.l('search-members'),
  });

  t.div('.pop-over-section.js-suggestions', function () {
    t.h4(function () {
      t.icon('sparkle');
      return t.format('suggested');
    });

    t.ul('.pop-over-member-list.checkable.u-clearfix.js-mem-list');
  });

  t.div('.pop-over-section.js-board-members', () =>
    memberSection('board-members'),
  );

  if (includeOrgMembers) {
    t.div('.pop-over-section.js-org-members', () =>
      memberSection('team-members'),
    );

    t.div('.js-show-org-members', () =>
      t.a('.subtle.button.full', { href: '#', style: 'margin-top: 8px;' }, () =>
        t.format('show-team-members'),
      ),
    );
  }

  t.div('.js-invite-no-results.hide', () =>
    t.p('.empty', { style: 'padding: 24px 6px' }, function () {
      if (canInviteMembers) {
        return t.l('not-a-member');
      } else {
        return t.l('no-results');
      }
    }),
  );

  t.div('.js-invite-results.hide');

  return t.div('.js-invite-error.hide', () =>
    t.p('.error', { style: 'margin: 16px 8px 6px;' }),
  );
});
