/* eslint-disable
    @trello/enforce-file-ownership,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'cant_add_board_to_ent',
);

module.exports = () =>
  t.p('.quiet', function () {
    t.mustacheBlock('isEntAdmin', () =>
      t.format(
        'enterprise-displayname-does-not-allow-new-boards-you-can-change-this-on-the-enterprise-settings-page-by-clicking-on-board-creation-restrictions',
        {
          'enterprise.displayName': t.mustacheVar('enterprise.displayName'),
          entSettingsUrl: t.mustacheVar('entSettingsUrl'),
        },
      ),
    );
    return t.mustacheBlockInverted('isEntAdmin', () =>
      t.format(
        'enterprise-displayname-does-not-allow-new-boards-only-an-admin-of-the-enterprise-can-change-this-setting',
        {
          'enterprise.displayName': t.mustacheVar('enterprise.displayName'),
        },
      ),
    );
  });
