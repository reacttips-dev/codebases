// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')('member');

module.exports = t.renderable(function ({
  avatarUrl,
  viewTitle,
  initials,
  isDeactivated,
  isBoardAdmin,
  isOrganizationAdmin,
}) {
  const title = viewTitle;
  if (avatarUrl) {
    const avatarUrl1x = [avatarUrl, '30.png'].join('/');
    const avatarUrl2x = [avatarUrl, '50.png'].join('/');
    t.img({
      class: 'member-avatar',
      height: '30',
      width: '30',
      src: avatarUrl1x,
      srcset: `${avatarUrl1x} 1x, ${avatarUrl2x} 2x`,
      alt: title,
      title,
    });
  } else if (initials) {
    t.span('.member-initials', { title, 'aria-label': title }, () =>
      t.text(initials),
    );
  } else {
    t.div('.member-icon-container', () => t.icon('member'));
  }

  if (!isDeactivated) {
    if (isBoardAdmin) {
      t.span('.member-type.admin', {
        title: t.l('this-member-is-an-admin-of-this-board'),
      });
    }
    if (isOrganizationAdmin) {
      t.span('.member-type.admin', {
        title: t.l('this-member-is-an-admin-of-this-organization'),
      });
    }
  }

  return t.span('.member-gold-badge', {
    title: t.l('this-member-has-trello-gold'),
  });
});
