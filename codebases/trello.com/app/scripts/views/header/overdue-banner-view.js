/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let OverdueBannerView;
const $ = require('jquery');
const WarningBannerView = require('app/scripts/views/header/warning-banner-view');
const { ProductFeatures } = require('@trello/product-features');
const { Auth } = require('app/scripts/db/auth');
const { Controller } = require('app/scripts/controller');
const templates = require('app/scripts/views/internal/templates');
const { Analytics, getScreenFromUrl } = require('@trello/atlassian-analytics');
const { getNextBillingDate } = require('@trello/paid-account');

module.exports = OverdueBannerView = (function () {
  OverdueBannerView = class OverdueBannerView extends WarningBannerView {
    static initClass() {
      this.prototype.className = 'header-banner mod-warning overdue-banner';

      this.prototype.events = {
        'click .js-update-billing-information': 'updateBillingInformation',
        'click .js-dismiss-overdue-banner': 'dismiss',
      };
    }

    getMessageName() {
      const billingDate = (
        getNextBillingDate(this.model.get('paidAccount')) ?? new Date()
      ).getTime();
      return `OverdueBanner-${this.model.id}-${billingDate}`;
    }

    render() {
      Analytics.sendViewedBannerEvent({
        name: 'overdueBanner',
        source: getScreenFromUrl(),
        containers: {
          organization: {
            id: this.model != null ? this.model.id : undefined,
          },
        },
        attributes: {
          isTeamAdmin: true,
        },
      });

      const data = {
        team: this.model.get('displayName'),
        billingUrl: Controller.getOrganizationBillingUrl(this.model),
        planName: ProductFeatures.getProductName(this.model.getProduct()),
      };
      this.$el.html(
        templates.fill(
          require('app/scripts/views/templates/header_overdue_banner'),
          data,
        ),
      );

      return this;
    }

    updateBillingInformation() {
      return Analytics.sendClickedLinkEvent({
        linkName: 'updateBillingInfoLink',
        source: 'overdueBanner',
        containers: {
          organization: {
            id: this.model != null ? this.model.id : undefined,
          },
        },
        attributes: {
          isTeamAdmin: true,
        },
      });
    }

    dismiss(e) {
      Analytics.sendDismissedComponentEvent({
        componentType: 'banner',
        componentName: 'overdueBanner',
        source: getScreenFromUrl(),
        containers: {
          organization: {
            id: this.model != null ? this.model.id : undefined,
          },
        },
        attributes: {
          isTeamAdmin: true,
        },
      });

      Auth.me().dismiss(this.getMessageName());
      $('.overdue-banner').remove();
      return e.preventDefault();
    }
  };
  OverdueBannerView.initClass();
  return OverdueBannerView;
})();
