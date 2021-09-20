// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'logged_in_public_board_banner',
);

module.exports = t.renderable(function ({
  isAdmin,
  isVisible,
  trelloForTeams,
  isTemplate,
}) {
  if (isVisible) {
    t.div('.logged-in-public-board-message', () =>
      t.div('.logged-in-public-board-body', function () {
        if (trelloForTeams) {
          t.span(() => t.format('ready-for-more-productive-teamwork'));
          t.a(
            {
              class: 'nch-button nch-button--primary js-copy-board',
              href: '#',
            },
            () => t.format('copy-this-board'),
          );
        }

        if (isTemplate) {
          t.icon('public', { class: 'icon-lg icon-public' });
          t.span(function () {
            if (isAdmin) {
              return t.format('template-set-to-public-admin');
            } else {
              return t.format('template-set-to-public-visitors');
            }
          });
        } else {
          t.icon('public', { class: 'icon-lg icon-public' });
          t.span(function () {
            if (isAdmin) {
              return t.format('you-can-change-its-visibility-at-any-time');
            } else {
              return t.format(
                'board-admins-can-change-its-visibility-setting-at-any-time',
              );
            }
          });
        }
        return t.a(
          {
            href:
              'https://help.trello.com/article/789-changing-the-visibility-of-a-board-to-public-private-or-team',
            target: '_blank',
            class: 'js-learn-more',
          },
          () => t.format('learn-more-here'),
        );
      }),
    );

    return t.a('.icon-lg.icon-close.js-close-banner', { href: '#' });
  }
});
