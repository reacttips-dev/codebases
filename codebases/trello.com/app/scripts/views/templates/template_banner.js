// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'template_banner',
);

module.exports = t.renderable(function ({
  isVisible,
  isPrivate,
  isPublic,
  isLoggedIn,
  teamName,
  returnUrl,
}) {
  if (isVisible) {
    t.div(
      '.template-banner-message',
      { class: t.classify({ public: isPublic }) },
      function () {
        if (isPublic) {
          t.span('.icon-sm.icon-public');
          if (isLoggedIn) {
            return t.span(() =>
              t.format(
                'this-is-a-public-template-for-anyone-on-the-internet-to-copy',
              ),
            );
          } else {
            return t.span(() =>
              t.format('new-to-trello-sign-up-free-to-copy-this-template'),
            );
          }
        } else {
          if (teamName) {
            return t.span(() =>
              t.format('this-is-a-template-for-members-of-team-to-copy', {
                teamName,
              }),
            );
          } else {
            return t.span(() =>
              t.format('this-is-a-private-template-for-members-to-copy'),
            );
          }
        }
      },
    );

    if (isLoggedIn) {
      t.a(
        '.nch-button.nch-button--primary.js-copy-template',
        { tabindex: '0', href: '#', title: t.l('create-board-from-template') },
        () => t.format('create-board-from-template'),
      );
    } else {
      t.a(
        '.nch-button.nch-button--primary',
        { tabindex: '0', href: returnUrl, title: t.l('get-started') },
        () => t.format('get-started'),
      );
    }

    if (!isPrivate) {
      return t.a(
        '.button.js-share-template',
        { tabindex: '0', href: '#', title: t.l('share-template') },
        () => t.format('share-template'),
      );
    }
  }
});
