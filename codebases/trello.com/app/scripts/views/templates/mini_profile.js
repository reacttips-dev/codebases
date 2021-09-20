// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'mini_profile',
);

module.exports = t.renderable(
  ({
    avatarUrl,
    viewTitle,
    fullName,
    username,
    initials,
    bio,
    email,
    showEmail,
    isMe,
    isDeactivated,
    activityBlocked,
  }) =>
    t.div('.mini-profile', function () {
      t.div(
        '.mini-profile-member.member-large',
        {
          class: t.classify({
            'member-deactivated': isDeactivated || activityBlocked,
          }),
        },
        function () {
          if (avatarUrl) {
            t.a('.av-btn.js-view-large', { href: '#' });
          }
          const title = viewTitle;
          if (avatarUrl) {
            return t.img('.member-avatar', {
              height: '50',
              width: '50',
              src: [avatarUrl, '50.png'].join('/'),
              alt: title,
              title,
            });
          } else if (initials) {
            return t.span('.member-initials', { title }, () =>
              t.text(initials),
            );
          } else {
            return t.div('.member-icon-container', () => t.icon('member'));
          }
        },
      );

      return t.div('.mini-profile-info', function () {
        t.h3('.mini-profile-info-title', () =>
          t.a(
            '.mini-profile-info-title-link.js-profile',
            { href: `/${username}` },
            () => t.text(fullName),
          ),
        );
        t.p('.quiet.u-bottom', () => t.format('at-username', { username }));

        if (bio) {
          t.p('.mini-profile-info-bio.quiet', () => t.text(bio));
        }
        if (showEmail) {
          t.p('.u-bottom.quiet', () => t.text(email));
        }
        if (isMe) {
          return t.p('.u-bottom', function () {
            const className = '.quiet';
            const href = `/${username}/profile`;
            return t.a(className, { href }, () =>
              t.format('edit-profile-info'),
            );
          });
        }
      });
    }),
);
