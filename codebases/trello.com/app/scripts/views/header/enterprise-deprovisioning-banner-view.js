// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let EnterpriseDeprovisioningBannerView;
const $ = require('jquery');
const WarningBannerView = require('app/scripts/views/header/warning-banner-view');
const { Auth } = require('app/scripts/db/auth');
const template = require('app/scripts/views/templates/header_enterprise_deprovisioning');
const { Analytics, getScreenFromUrl } = require('@trello/atlassian-analytics');

module.exports = EnterpriseDeprovisioningBannerView = (function () {
  EnterpriseDeprovisioningBannerView = class EnterpriseDeprovisioningBannerView extends (
    WarningBannerView
  ) {
    static initClass() {
      this.prototype.className =
        'header-banner mod-warning enterprise-deprovisioning-banner';

      this.prototype.events = {
        'click .js-dismiss-enterprise-deprovisioning-banner': 'dismiss',
      };
    }

    render() {
      const data = {
        enterpriseName: this.model.displayName,
        enterpriseStanding: this.model.enterpriseStanding,
        pendingDeprovision: this.model.pendingDeprovision,
      };
      this.$el.html(template(data));

      Analytics.sendViewedBannerEvent({
        bannerName: 'enterpriseDeprovisioningBanner',
        source: getScreenFromUrl(),
        containers: {
          enterprise: {
            id: this.model.idEnterprise,
          },
        },
      });

      return this;
    }

    dismiss(e) {
      Analytics.sendDismissedComponentEvent({
        componentType: 'banner',
        componentName: 'enterpriseDeprovisioningBanner',
        source: getScreenFromUrl(),
        containers: {
          enterprise: {
            id: this.model.idEnterprise,
          },
        },
      });

      Auth.me().dismissEnterpriseDeprovisioningBannerFor(
        this.model.idEnterprise,
      );
      $(e.target).closest('.enterprise-deprovisioning-banner').remove();
      return e.preventDefault();
    }
  };
  EnterpriseDeprovisioningBannerView.initClass();
  return EnterpriseDeprovisioningBannerView;
})();
