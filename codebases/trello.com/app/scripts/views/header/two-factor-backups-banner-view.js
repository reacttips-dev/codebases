// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const WarningBannerView = require('app/scripts/views/header/warning-banner-view');
const templates = require('app/scripts/views/internal/templates');

module.exports = class TwoFactorBackupsBannerView extends WarningBannerView {
  render() {
    this.$el.html(
      templates.fill(
        require('app/scripts/views/templates/header_two_factor_backups_banner'),
      ),
    );
    return this;
  }
};
