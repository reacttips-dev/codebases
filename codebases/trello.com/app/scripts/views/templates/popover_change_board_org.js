// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'popover_change_board_org',
);
const { BoardHeaderTestIds } = require('@trello/test-ids');

module.exports = t.renderable(
  ({
    orgs,
    allowsSelfJoin,
    hasOrg,
    idOrganization,
    isMemberOfBoardOrg,
    isPrivate,
    isDesktop,
    isTemplate,
    addToTeam,
    hasEnterprise,
    enterpriseName,
    showPrivateBoardsOptionForEntBoards,
    blockTeamlessBoardsEnabled,
  }) =>
    t.form(function () {
      t.label(
        { 'data-test-id': BoardHeaderTestIds.ChangeTeamSelectLabel },
        function () {
          if (isTemplate) {
            return t.format('this-template-is-part-of');
          } else {
            return t.format('this-board-is-part-of');
          }
        },
      );
      t.select('.js-org', function () {
        if (
          !blockTeamlessBoardsEnabled &&
          (!hasEnterprise || showPrivateBoardsOptionForEntBoards)
        ) {
          t.optionSelected(!orgs, { value: '' }, () =>
            t.format('personal-boards-no-team'),
          );
        } else if (
          blockTeamlessBoardsEnabled &&
          idOrganization &&
          !isMemberOfBoardOrg
        ) {
          t.optionSelected(true, { value: idOrganization }, () =>
            t.format('private-workspace'),
          );
        }

        return Array.from(orgs).map((org) =>
          t.optionSelected(org.select, { value: org.id }, () =>
            t.text(org.displayName),
          ),
        );
      });

      if (hasEnterprise && !showPrivateBoardsOptionForEntBoards) {
        t.div('.quiet', () =>
          t.format('board-can-only-be-moved-to-teams-within-org', {
            enterpriseName,
          }),
        );
      }

      t.div('.template-alert-notice.js-template-alert', () =>
        t.format('moving-a-template'),
      );

      t.div('.spinner.loading.js-loading.hide');

      return t.div('.js-loaded.hide', function () {
        t.div('.js-billable-guests-warning.move-board-to-org.hide');

        t.div('.js-permissions.hide', function () {
          if (isPrivate) {
            t.div('.check-div.js-check-div', function () {
              t.input('.js-make-org-visible', {
                type: 'checkbox',
                checked: hasOrg ? false : true,
                id: 'orgVisible',
              });
              return t.label({ for: 'orgVisible' }, () =>
                t.format('make-board-visible-to-organization'),
              );
            });
          }

          if (!allowsSelfJoin && !isTemplate) {
            return t.div('.check-div.js-check-div', function () {
              t.input('.js-make-org-joinable', {
                type: 'checkbox',
                checked: true,
                id: 'orgJoinable',
              });
              return t.label({ for: 'orgJoinable' }, () =>
                t.format('allow-any-org-member-to-join-this-board'),
              );
            });
          }
        });

        t.div('.board-limits-upgrade-ad.js-board-limits-upgrade-ad.hide', () =>
          t.p(function () {
            if (isDesktop) {
              return t.format(
                'board-cant-be-moved-because-of-board-limits-desktop',
              );
            } else {
              return t.format('board-cant-be-moved-because-of-board-limits');
            }
          }),
        );

        t.input('.js-submit.wide.nch-button.nch-button--primary.disabled', {
          type: 'submit',
          value: addToTeam ? t.l('add') : t.l('change'),
        });

        return t.a(
          { href: '#', class: 'js-new-org right-of-button-link' },
          () => t.format('create-team'),
        );
      });
    }),
);
