// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let EnterpriseNotificationBannerView;
const $ = require('jquery');
const WarningBannerView = require('app/scripts/views/header/warning-banner-view');
const { Auth } = require('app/scripts/db/auth');
const template = require('app/scripts/views/templates/header_enterprise_notification');

module.exports = EnterpriseNotificationBannerView = (function () {
  EnterpriseNotificationBannerView = class EnterpriseNotificationBannerView extends (
    WarningBannerView
  ) {
    static initClass() {
      this.prototype.events = {
        'click .js-dismiss-enterprise-notification-banner': 'dismiss',
      };
    }
    className() {
      return `header-banner mod-warning enterprise-notification-banner ${this.model.oneTimeMessageId}`;
    }

    render() {
      const data = {
        enterpriseName: this.model.displayName,
        formattedMessage: this.model.message,
        oneTimeMessageId: this.model.oneTimeMessageId,
      };

      this.$el.html(template(data));

      return this;
    }

    dismiss(e) {
      Auth.me().dismiss(this.model.oneTimeMessageId);
      $(e.target).closest('.enterprise-notification-banner').remove();
      return e.preventDefault();
    }
  };
  EnterpriseNotificationBannerView.initClass();
  return EnterpriseNotificationBannerView;
})();
