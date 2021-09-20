// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'header_invite',
);
const memberAvatarTemplate = require('./member_avatar');

module.exports = t.renderable(
  ({
    isInviter,
    isInternetExplorer,
    ghost,
    modelName,
    memberAdder,
    avatarUrl,
    fullName,
    username,
    modelType,
    isLoggedIn,
    isBoard,
    signupUrl,
    isGhostEmailLoggedIn,
    me,
    email,
    isAaMastered,
  }) =>
    t.div('.invited-message', function () {
      if (isLoggedIn) {
        if (ghost.email) {
          t.div(
            '.personalized-invite-message',
            { class: t.classify({ 'logged-in': isLoggedIn }) },
            function () {
              const loginMessage = isBoard
                ? 'youll-need-to-create-an-account-for-trello-with-ghost-email-to-join-this-board'
                : 'youll-need-to-create-an-account-for-trello-with-ghost-email-to-join-this-team';
              return t.format(loginMessage, {
                email,
                'ghost.email': ghost.email,
              });
            },
          );
          return t.a('.quiet.js-signup', { href: signupUrl }, () =>
            t.format('create-an-account'),
          );
        }
      } else {
        t.a('.personalized-invite-trello-logo', {
          href: '/',
          target: '_blank',
          class: t.classify({ 'mod-ie': isInternetExplorer }),
        });
        if (memberAdder) {
          t.span('.member', () => memberAvatarTemplate(memberAdder));
          t.div('.personalized-invite-message', function () {
            const welcomeMessage = isBoard
              ? 'welcome-to-trello-join-the-modelname-board-to-start-collaborating-with-fullname'
              : 'welcome-to-trello-join-the-modelname-org-to-start-collaborating-with-fullname';
            return t.format(welcomeMessage, {
              fullName: memberAdder.fullName,
              modelName,
            });
          });
        } else {
          t.div('.personalized-invite-message', () =>
            t.format('youve-been-invited-to-collaborate-on-modelname', {
              modelName,
            }),
          );
        }

        return t.a(
          '.nch-button.nch-button--primary.personalized-invite-right-button.js-join-button',
          { href: signupUrl },
          function () {
            if (isBoard) {
              return t.format('join-board');
            } else {
              return t.format('join-org');
            }
          },
        );
      }
    }),
);
