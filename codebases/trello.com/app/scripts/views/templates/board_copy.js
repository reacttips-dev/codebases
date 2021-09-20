// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'board_copy',
);
const { featureFlagClient } = require('@trello/feature-flag-client');

module.exports = function () {
  t.mustacheBlock('loading', () => t.div('.spinner.loading'));
  return t.mustacheBlockInverted('loading', () =>
    t.form(function () {
      t.label({ for: 'boardNewTitle' }, () => t.format('title'));
      t.input('.non-empty.js-autofocus', {
        id: 'boardNewTitle',
        type: 'text',
        name: 'name',
        placeholder: t.mustacheVar('placeholder'),
        value: t.mustacheVar('boardNameInputValue'),
        dir: 'auto',
      });

      t.div({ class: t.mustacheBlock('hideOrg', () => 'hide') }, function () {
        t.div('.u-clearfix', function () {
          t.label('.u-float-left', { style: 'margin-right: 8px;' }, () =>
            t.format('organization'),
          );
          return t.mustacheBlock('canAddToOrgs', () =>
            t.a('.icon-sm.icon-information.dark-hover.js-helper-add-org', {
              href: '#',
            }),
          );
        });

        t.mustacheBlock('hasEnterprise', () =>
          t.mustacheBlock('enterpriseName', function () {
            if (!t.mustacheVar('showPrivateBoardsOptionForEntBoards')) {
              return t.p('.quiet', () =>
                t.format('board-can-only-be-copied-to-teams-within-org', {
                  enterpriseName: t.mustacheVar('enterpriseName'),
                }),
              );
            }
          }),
        );

        t.mustacheBlockInverted('canAddToOrgs', () =>
          t.p('.quiet', { style: 'margin-bottom: 16px;' }, function () {
            t.format('organization-whisk-n-tsk');
            t.text(' ');
            return t.a('.js-create-org', { href: '#' }, () =>
              t.format('create-an-organization'),
            );
          }),
        );

        return t.select(
          {
            name: 'org-id',
            class: t.mustacheBlockInverted('canAddToOrgs', () => 'hide'),
          },
          function () {
            t.mustacheBlockInverted('blockTeamlessBoardsEnabled', () => {
              if (
                !t.mustacheVar('hasEnterprise') ||
                t.mustacheVar('showPrivateBoardsOptionForEntBoards')
              ) {
                return t.option({ value: '' }, () => t.format('none'));
              }
            });
            return t.mustacheBlock('orgs', () =>
              t.optionSelected(
                t.mustacheVar('selectOrg'),
                { value: t.mustacheVar('id') },
                () => t.text(t.mustacheVar('displayName')),
              ),
            );
          },
        );
      });

      t.div('.board-limits-upgrade-ad.js-board-limits-upgrade-ad.hide', () =>
        t.p(function () {
          if (t.mustacheVar('isDesktop')) {
            return t.format(
              'board-cant-be-copied-because-of-board-limits-desktop',
            );
          } else {
            return t.div('.copy-board-upsell-react-component');
          }
        }),
      );

      t.div('.js-permissions.hide', function () {
        t.input({
          type: 'hidden',
          name: 'permissionLevel',
          value: t.mustacheVar('pLevel'),
        });

        t.p('.quiet.js-vis-display');

        t.ul('.pop-over-list.js-vis-chooser.hide');

        t.p('.error.u-bottom.js-no-valid-org-privs.u-clearfix.hide');

        t.div('.js-confirm-public-message.hide', function () {
          t.p(t.mustacheVar('publicConfirmationText'));
          t.input(
            '.pop-over-confirmation-button.nch-button.nch-button--primary.js-confirm-public',
            {
              type: 'button',
              value: t.mustacheVar('publicConfirmationConfirm'),
            },
          );
          return t.input('.pop-over-confirmation-button.js-cancel-public', {
            type: 'button',
            value: t.mustacheVar('publicConfirmationCancel'),
          });
        });

        t.div(
          '.check-div.u-clearfix',
          { style: 'margin-top: 10px;' },
          function () {
            t.input({
              type: 'checkbox',
              id: 'idKeepCards',
              name: 'cards',
              checked: true,
            });
            return t.label({ for: 'idKeepCards' }, () =>
              t.format('keep-cards'),
            );
          },
        );
        t.div(
          '.check-div.u-clearfix',
          { style: 'margin-top: 10px;' },
          function () {
            t.input({
              type: 'checkbox',
              id: 'idKeepTemplateCards',
              name: 'templates',
              checked: true,
            });
            return t.label({ for: 'idKeepTemplateCards' }, () =>
              t.format('keep-template-cards'),
            );
          },
        );
        t.p('.quiet', () =>
          t.format('activity-and-members-will-not-be-copied'),
        );

        t.mustacheBlock('willRemovePowerUps', () =>
          t.p('.quiet', () => t.format('power-ups-will-not-be-copied')),
        );

        if (featureFlagClient.get('ecosystem.repackaging-pups', false)) {
          t.p('.js-custom-fields-disabled-warning.quiet.hide');
        }
      });

      return t.input(
        '.nch-button.nch-button--primary.wide.js-submit.disabled',
        {
          type: 'submit',
          value: t.l('create'),
        },
      );
    }),
  );
};
