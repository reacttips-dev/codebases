// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let EnterpriseLicenseBannerView;
const $ = require('jquery');
const WarningBannerView = require('app/scripts/views/header/warning-banner-view');
const { Auth } = require('app/scripts/db/auth');
const template = require('app/scripts/views/templates/header_enterprise_license');
const { Analytics, getScreenFromUrl } = require('@trello/atlassian-analytics');

module.exports = EnterpriseLicenseBannerView = (function () {
  EnterpriseLicenseBannerView = class EnterpriseLicenseBannerView extends (
    WarningBannerView
  ) {
    static initClass() {
      this.prototype.className =
        'header-banner mod-warning enterprise-license-banner';

      this.prototype.events = {
        'click .js-dismiss-enterprise-license-banner': 'dismiss',
      };
    }

    render() {
      const data = {
        enterpriseName: this.model.displayName,
        maxMembers: this.model.seats.max,
        availableLicenses: this.model.seats.available,
      };
      this.$el.html(template(data));

      Analytics.sendViewedBannerEvent({
        bannerName: 'enterpriseLicenseBanner',
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
        componentName: 'enterpriseLicenseBanner',
        source: getScreenFromUrl(),
        containers: {
          enterprise: {
            id: this.model.idEnterprise,
          },
        },
      });

      Auth.me().dismissEnterpriseBannerFor(this.model.idEnterprise);
      $(e.target).closest('.enterprise-license-banner').remove();
      return e.preventDefault();
    }
  };
  EnterpriseLicenseBannerView.initClass();
  return EnterpriseLicenseBannerView;
})();
