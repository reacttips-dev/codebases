// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/recup-with-helpers')(
  'manage_members',
);
const { Analytics } = require('@trello/atlassian-analytics');

module.exports = t.statelessRenderable(
  'Member',
  function ({ isSelected, member, toggleMember }) {
    const { avatarUrl, fullName, initials, id, username } = member;

    const disabled = member.joined;

    const onClick = function () {
      if (!disabled) {
        Analytics.sendUIEvent({
          action: 'clicked',
          actionSubject: 'menuItem',
          actionSubjectId: 'inviteMembersMenuItem',
          source: 'inviteToWorkspaceInlineDialog',
          attributes: {
            selected: !isSelected,
          },
        });
        return toggleMember(id);
      }
    };
    const onKeyUp = function (e) {
      if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
        return onClick();
      }
    };

    const selectedClass = isSelected ? '.checked' : '';
    const titleText = `${fullName} (${username})`;

    return t.div(
      '.member-wrapper',
      {
        class: t.classify({ disabled: disabled }),
        tabIndex: 0,
        onClick,
        onKeyUp,
      },
      function () {
        t.div('.member', function () {
          if (avatarUrl) {
            return t.img('.member-avatar', {
              height: '32',
              width: '32',
              src: `${avatarUrl}/50.png`,
              srcSet: `${avatarUrl}/50.png 1x, ${avatarUrl}/50.png 2x`,
              alt: titleText,
              title: titleText,
            });
          } else if (initials) {
            return t.span('.member-initials', { title: titleText }, () =>
              t.text(initials),
            );
          } else {
            return t.div('.member-icon-container', () => t.icon('member'));
          }
        });
        t.div('.full-name', () => t.text(fullName));
        t.div('.username.quiet', () => t.text(`@${username}`));

        if (!disabled) {
          return t.div(`.checkbox${selectedClass}`, () =>
            t.span('.icon-lg.icon-check'),
          );
        }
      },
    );
  },
);
