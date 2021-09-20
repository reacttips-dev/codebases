// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const View = require('app/scripts/views/internal/view');

class WarningBannerView extends View {
  static initClass() {
    this.prototype.className = 'header-banner mod-warning';
  }
}

WarningBannerView.initClass();
module.exports = WarningBannerView;
