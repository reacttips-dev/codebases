/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'member_on_card',
);
const memberTemplate = require('./member');

module.exports = t.renderable(
  ({
    avatarUrl,
    fullName,
    id,
    initials,
    isDeactivated,
    isBoardAdmin,
    isOrganizationAdmin,
    isVirtual,
    username,
    viewTitle,
    activityBlocked,
  }) =>
    t.div(
      '.member.js-member-on-card-menu',
      {
        class: t.classify({
          'member-deactivated': isDeactivated || activityBlocked,
          'member-virtual': isVirtual,
          'long-initials': (initials != null ? initials.length : undefined) > 2,
        }),
        'data-idmem': id,
      },
      () =>
        memberTemplate({
          avatarUrl,
          fullName,
          initials,
          isDeactivated,
          isBoardAdmin,
          isOrganizationAdmin,
          username,
          viewTitle,
        }),
    ),
);
