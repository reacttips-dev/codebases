/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { Dates } = require('app/scripts/lib/dates');
const { Util } = require('app/scripts/lib/util');
const View = require('app/scripts/views/internal/view');
const template = require('app/scripts/views/templates/header_warning_account_transfer_required');

class AccountTransferRequiredBannerView extends View {
  static initClass() {
    this.prototype.className = 'header-banner';

    this.prototype.events = {
      'click .js-dismiss-account-transfer': 'dismiss',
    };
  }

  constructor({ enterprise }) {
    super(...arguments);
    this.enterprise = enterprise;
  }

  dismiss(e) {
    Util.stop(e);
    return this.model.dismissAccountTransferBanner(() => {
      return this.remove();
    });
  }

  _remainingDays() {
    const targetDate = Dates.parse(this.enterprise.prefs.mandatoryTransferDate);
    return Dates.getDaysUntil(targetDate);
  }

  renderRemainingDays() {
    const remainingDays = this._remainingDays();
    if (remainingDays <= 10) {
      this.$el.addClass('mod-warning');
    } else {
      this.$el.addClass('mod-info');
    }

    if (1 < remainingDays && remainingDays <= 5) {
      this.$el.addClass('mod-medium-urgent');
    } else if (remainingDays <= 1) {
      this.$el.addClass('mod-urgent');
    }

    return this.$el.html(
      template({
        targetDate: Dates.toDateString(
          this.enterprise.prefs.mandatoryTransferDate,
        ),
        enterpriseDisplayName: this.enterprise.displayName,
      }),
    );
  }

  render() {
    if (
      !this.model.isAccountTransferBannerDismissed() &&
      this.enterprise != null
    ) {
      this.renderRemainingDays();
    }
    return this;
  }
}

AccountTransferRequiredBannerView.initClass();
module.exports = AccountTransferRequiredBannerView;
