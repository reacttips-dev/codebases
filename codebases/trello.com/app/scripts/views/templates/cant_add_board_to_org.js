// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'cant_add_board_to_org',
);

module.exports = () =>
  t.p('.quiet', function () {
    t.mustacheBlock('isOrgAdmin', () =>
      t.format(
        'organization-displayname-does-not-allow-new-boards-you-can-change-this-on-the-organization-settings-page-by-clicking-on-board-creation-restrictions',
        {
          'organization.displayName': t.mustacheVar('organization.displayName'),
          orgSettingsUrl: t.mustacheVar('orgSettingsUrl'),
        },
      ),
    );
    return t.mustacheBlockInverted('isOrgAdmin', () =>
      t.format(
        'organization-displayname-does-not-allow-new-boards-only-an-admin-of-the-organization-can-change-this-setting',
        {
          'organization.displayName': t.mustacheVar('organization.displayName'),
        },
      ),
    );
  });
