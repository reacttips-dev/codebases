// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'invitee_orientation',
);

module.exports = t.renderable(function ({
  visibleMembersCount,
  maxVisible,
  firstMemberFullName,
  boardName,
  inviterAvatarUrl,
  inviterFullName,
  inviterUsername,
  inviterInitials,
}) {
  t.div('.invitee-orientation-message-container.arrow', function () {
    t.a(
      '.js-close-orientation.pop-over-header-close-btn.close-invitee-orientation.icon-sm.icon-close',
      { href: '#' },
    );

    t.h1(() => {
      return t.format('welcome-to-trello-wave');
    });

    return t.div(function () {
      t.div('.orientation-header', function () {
        t.div(
          '.board-header-facepile.invitee-orientation-facepile.js-invitee-orientation-facepile',
        );

        return t.div('.orientation-facepile-text', function () {
          if (visibleMembersCount > 0) {
            t.b(function () {
              t.text(firstMemberFullName);
              return t.raw('&nbsp;');
            });

            if (visibleMembersCount === 1) {
              return t.format('is-also-here');
            } else {
              if (visibleMembersCount === 2) {
                return t.format('one-other-is-here');
              } else {
                return t.format('count-others-are-here', {
                  count: visibleMembersCount - 1,
                });
              }
            }
          }
        });
      });

      return t.div('.invitee-orientation-text.u-clearfix', function () {
        t.p(() => t.format('main-message', { boardName }));
        return t.p(() => t.format('that-s-all'));
      });
    });
  });

  return t.div('.invitee-orientation-avatar-container', function () {
    if (inviterAvatarUrl) {
      return t.img('.invitee-orientation-avatar', {
        src: [inviterAvatarUrl, '50.png'].join('/'),
        alt: inviterFullName,
        title: `${inviterFullName} (${inviterUsername})`,
      });
    } else {
      return t.div('.invitee-orientation-initials-wrapper', () =>
        t.span('.invitee-orientation-initials', () => t.text(inviterInitials)),
      );
    }
  });
});
