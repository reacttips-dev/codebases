// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'board_menu_more',
);

module.exports = t.renderable(function ({
  shortUrl,
  editableByMember,
  isAdmin,
  isLoggedIn,
  canCloseOrLeave,
  canCloseBoard,
  canCopyBoard,
  canLeaveBoard,
  pLevelAltText,
  pLevelClass,
  helperText,
  showCollections,
  isTemplate,
  canBeTemplate,
  isOrgBcOrEnt,
  showTemplateUpgrade,
}) {
  t.ul('.board-menu-navigation', function () {
    t.li('.board-menu-navigation-item', () =>
      t.a(
        '.board-menu-navigation-item-link.js-open-settings',
        { href: '#' },
        () =>
          t.icon('gear', 'settings', {
            class: 'board-menu-navigation-item-link-icon',
          }),
      ),
    );

    t.li('.board-menu-navigation-item', () =>
      t.a(
        '.board-menu-navigation-item-link.js-open-labels',
        { href: '#' },
        () =>
          t.icon('label', 'labels', {
            class: 'board-menu-navigation-item-link-icon',
          }),
      ),
    );

    if (showCollections) {
      if (isOrgBcOrEnt) {
        t.li('.board-menu-navigation-item', () =>
          t.a(
            '.board-menu-navigation-item-link.js-open-collections',
            { href: '#' },
            () =>
              t.icon('collection', 'collections', {
                class: 'board-menu-navigation-item-link-icon',
              }),
          ),
        );
      } else {
        t.li('.board-menu-navigation-item.disabled', function () {
          t.span('.board-menu-navigation-item-link.', function () {
            t.icon('collection', 'collections', {
              class: 'board-menu-navigation-item-link-icon',
            });
            return t.div(
              '.board-menu-pill-upgrade.js-board-menu-pill-collections-upgrade',
            );
          });
          return t.div('.js-board-menu-prompt-collections');
        });
      }
    }

    return t.li('.board-menu-navigation-item', () =>
      t.a(
        '.board-menu-navigation-item-link.js-open-archive',
        { href: '#' },
        () =>
          t.icon('archive', 'archived-items', {
            class: 'board-menu-navigation-item-link-icon',
          }),
      ),
    );
  });

  t.hr();

  t.ul('.board-menu-navigation', function () {
    if (editableByMember && !isTemplate) {
      t.li('.board-menu-navigation-item', () =>
        t.a('.board-menu-navigation-item-link.js-email', { href: '#' }, () =>
          t.icon('email', 'email-to-board-settings', {
            class: 'board-menu-navigation-item-link-icon',
          }),
        ),
      );
    }

    if (isLoggedIn && !isTemplate) {
      t.li('.board-menu-navigation-item', () =>
        t.a(
          '.board-menu-navigation-item-link.js-board-subscribe',
          { href: '#' },
          function () {
            t.icon('subscribe', 'watch', {
              class: 'board-menu-navigation-item-link-icon',
            });
            t.raw('&nbsp;');
            return t.span('.js-subscribed-state', () => t.icon('check'));
          },
        ),
      );
    }

    // Template toggle
    if (canBeTemplate && editableByMember && isAdmin) {
      t.li('.board-menu-navigation-item', function () {
        if (isTemplate) {
          return t.a(
            '.board-menu-navigation-item-link.js-convert-to-board',
            { href: '#' },
            function () {
              t.icon('board', {
                class: 'board-menu-navigation-item-link-icon',
              });
              t.raw('&nbsp;');
              return t.format('convert-to-board');
            },
          );
        } else {
          return t.a(
            '.board-menu-navigation-item-link.js-make-template',
            { href: '#' },
            function () {
              t.icon('template-board', {
                class: 'board-menu-navigation-item-link-icon',
              });
              t.raw('&nbsp;');
              return t.format('make-template');
            },
          );
        }
      });
    } else if (showTemplateUpgrade) {
      t.li('.board-menu-navigation-item.disabled', () =>
        t.span('.board-menu-navigation-item-link', function () {
          t.icon('template-board', {
            class: 'board-menu-navigation-item-link-icon',
          });
          t.raw('&nbsp;');
          t.format('make-template');
          return t.div(
            '.board-menu-pill-upgrade.js-board-menu-pill-templates-upgrade',
          );
        }),
      );
    }

    if (isLoggedIn && !isTemplate && canCopyBoard) {
      t.li('.board-menu-navigation-item', () =>
        t.a(
          '.board-menu-navigation-item-link.js-copy-board',
          { href: '#' },
          () =>
            t.icon('copy', 'copy-board', {
              class: 'board-menu-navigation-item-link-icon',
            }),
        ),
      );
    }

    return t.li('.board-menu-navigation-item', () =>
      t.a('.board-menu-navigation-item-link.js-share', { href: '#' }, () =>
        t.icon('share', 'print-and-export', {
          class: 'board-menu-navigation-item-link-icon',
        }),
      ),
    );
  });

  if (canCloseOrLeave) {
    t.hr();

    t.ul('.board-menu-navigation', function () {
      if (canCloseBoard) {
        t.li('.board-menu-navigation-item', () =>
          t.a(
            '.board-menu-navigation-item-link.js-close-board',
            { href: '#' },
            function () {
              t.raw('&nbsp;');
              if (isTemplate) {
                return t.format('close-template-ellipsis');
              } else {
                return t.format('close-board-ellipsis');
              }
            },
          ),
        );
      }

      if (canLeaveBoard) {
        return t.li('.board-menu-navigation-item', () =>
          t.a(
            '.board-menu-navigation-item-link.js-leave-board',
            { href: '#' },
            function () {
              t.raw('&nbsp;');
              return t.format('leave-board-ellipsis');
            },
          ),
        );
      }
    });
  }

  t.hr();

  return t.form('.u-gutter', function () {
    t.label({ for: 'id-short-url' }, function () {
      if (isTemplate) {
        return t.format('link-to-this-template');
      } else {
        return t.format('link-to-this-board');
      }
    });

    t.input('.js-short-url', {
      type: 'text',
      readonly: 'readonly',
      id: 'id-short-url',
      value: shortUrl,
    });

    t.p('.quiet', function () {
      t.span({ class: `icon-sm icon-${pLevelClass}`, title: pLevelAltText });
      return t.text(helperText);
    });

    return t.div('.js-qr-code');
  });
});
