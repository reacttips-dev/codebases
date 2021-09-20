// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')('member');

module.exports = t.renderable(function ({
  id,
  avatarUrl,
  viewTitle,
  initials,
  isDeactivated,
  isBoardAdmin,
  isOrganizationAdmin,
  hideBadges,
}) {
  if (avatarUrl) {
    t.img('.member-avatar', {
      height: '30',
      width: '30',
      src: [avatarUrl, '30.png'].join('/'),
      srcset: [
        [avatarUrl, '30.png 1x'].join('/'),
        [avatarUrl, '50.png 2x'].join('/'),
      ].join(', '),
      alt: viewTitle,
      title: viewTitle,
    });
  } else if (initials) {
    t.span(
      '.member-initials',
      {
        title: viewTitle,
        'aria-label': viewTitle,
      },
      () => t.text(initials),
    );
  } else {
    t.div('.member-icon-container', () => t.icon('member'));
  }

  if (id) {
    t.span(`#${id}-avatar`);
  }

  if (!isDeactivated && !hideBadges) {
    if (isBoardAdmin) {
      t.span('.member-type.admin', {
        title: t.l('this-member-is-an-admin-of-this-board'),
        'aria-label': t.l('this-member-is-an-admin-of-this-board'),
      });
    }
    if (isOrganizationAdmin) {
      t.span('.member-type.admin', {
        title: t.l('this-member-is-an-admin-of-this-organization'),
        'aria-label': t.l('this-member-is-an-admin-of-this-organization'),
      });
    }
  }

  if (!hideBadges) {
    return t.span('.member-gold-badge', {
      title: t.l('this-member-has-trello-gold'),
      'aria-label': t.l('this-member-has-trello-gold'),
    });
  }
});
