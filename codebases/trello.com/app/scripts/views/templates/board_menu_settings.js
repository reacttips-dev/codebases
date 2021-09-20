// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'board_menu_settings',
);

module.exports = function () {
  if (!t.mustacheVar('isLoggedIn')) {
    t.ul('.board-menu-navigation', () =>
      t.li('.board-menu-navigation-item', () =>
        t.a(
          '.js-change-cookie-settings.board-menu-navigation-item-link',
          { href: '#' },
          () => {
            return t.icon('gear', 'cookie-settings', {
              class: 'board-menu-navigation-item-link-icon',
            });
          },
        ),
      ),
    );

    t.hr();
  }

  return t.div(() =>
    t.ul('.pop-over-list.inset', () => {
      t.mustacheBlock('blockTeamlessBoardsEnabled', () => {
        return t.li('#board-settings-change-org');
      });
      t.mustacheBlockInverted('blockTeamlessBoardsEnabled', () => {
        return t.li(() => {
          return t.a(
            {
              class: `js-change-org${t.mustacheBlockInverted(
                'canChangeOrg',
                () => ' disabled',
              )}`,
              href: '#',
            },
            () => {
              t.mustacheBlock('setOrgNull', () => {
                return t.format('remove-from-organization');
              });
              t.mustacheBlockInverted('setOrgNull', () => {
                return t.format('change-organization-ellipsis');
              });
              return t.mustacheBlock('orgDisplayName', () => {
                return t.span('.sub-name', () => {
                  return t.text(t.mustacheVar('orgDisplayName'));
                });
              });
            },
          );
        });
      });

      t.hr();

      t.li(() => {
        return t.a(
          {
            class:
              t.mustacheBlock('__own', () => 'js-toggle-covers') +
              t.mustacheBlockInverted('__own', () => ' disabled'),
            href: '#',
          },
          () => {
            t.mustacheBlockInverted('cardCovers', () => {
              return t.format('enable-card-covers');
            });
            t.mustacheBlock('cardCovers', () => {
              t.format('card-covers-enabled');
              return t.icon('check');
            });
            return t.span('.sub-name', () => {
              return t.format(
                'show-image-attachments-and-colors-on-the-front-of-cards',
              );
            });
          },
        );
      });

      t.hr();

      if (!t.mustacheVar('isTemplate')) {
        t.li(() => {
          return t.a(
            {
              class:
                t.mustacheBlock('__own', () => 'js-change-comments') +
                t.mustacheBlockInverted('__own', () => ' disabled'),
              href: '#',
            },
            () => {
              return t.format(
                'commenting-permissions-ellipsis-commentsdisplay',
                { commentsDisplay: t.mustacheVar('commentsDisplay') },
              );
            },
          );
        });
      }

      if (t.mustacheVar('votingEnabled')) {
        t.li(() => {
          return t.a(
            {
              class:
                t.mustacheBlock('__own', () => 'js-change-voting') +
                t.mustacheBlockInverted('__own', () => ' disabled'),
              href: '#',
            },
            () => {
              return t.format('voting-permissions-ellipsis-votingdisplay', {
                votingDisplay: t.mustacheVar('votingDisplay'),
              });
            },
          );
        });
      }

      if (!t.mustacheVar('isTemplate')) {
        t.li(() => {
          return t.a(
            {
              class:
                t.mustacheBlock('__own', () => 'js-change-add-members') +
                t.mustacheBlockInverted('__own', () => ' disabled'),
              href: '#',
            },
            () => {
              return t.format(
                'invitations-permissions-ellipsis-invitationsdisplay',
                { invitationsDisplay: t.mustacheVar('invitationsDisplay') },
              );
            },
          );
        });

        t.hr();

        return t.li(() => {
          return t.a(
            {
              class: ` ${t.mustacheBlock(
                '__own',
                () => ' js-toggle-org-mem-join ',
              )} ${t.mustacheBlockInverted(
                '__own',
                () => ' disabled ',
              )} ${t.mustacheBlockInverted(
                'idOrganization',
                () => ' disabled ',
              )} ${t.mustacheBlock(
                'permissionLevel_private',
                () => ' disabled ',
              )} `,
              href: '#',
            },
            () => {
              t.check(
                t.mustacheVar('selfJoin_true'),
                'allow-team-members-to-edit-and-join',
              );
              return t.span('.sub-name', () => {
                t.mustacheBlock('hasOrg', () => {
                  return t.mustacheBlock('permissionLevel_private', () => {
                    return t.format(
                      'any-team-member-can-edit-and-join-this-board-to-enable-this-the-board-cant-be-private',
                    );
                  });
                });
                t.mustacheBlock('hasOrg', () => {
                  return t.mustacheBlockInverted(
                    'permissionLevel_private',
                    () => {
                      return t.format(
                        'any-team-member-can-edit-and-join-this-board',
                      );
                    },
                  );
                });
                t.mustacheBlockInverted('hasOrg', () => {
                  return t.mustacheBlock('permissionLevel_private', () => {
                    return t.format(
                      'any-team-member-can-edit-and-join-this-board-to-enable-this-the-board-has-to-be-a-part-of-a-team-and-the-board-cant-be-private',
                    );
                  });
                });
                return t.mustacheBlockInverted('hasOrg', () => {
                  return t.mustacheBlockInverted(
                    'permissionLevel_private',
                    () => {
                      return t.format(
                        'any-team-member-can-edit-and-join-this-board-to-enable-this-the-board-has-to-be-a-part-of-a-team',
                      );
                    },
                  );
                });
              });
            },
          );
        });
      }
    }),
  );
};
