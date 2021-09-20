/* eslint-disable
    eqeqeq,
    no-undef,
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
let ConfirmEmailBannerView;
const { ApiAjax } = require('app/scripts/network/api-ajax');
const { Auth } = require('app/scripts/db/auth');
const { Dates } = require('app/scripts/lib/dates');
const WarningBannerView = require('app/scripts/views/header/warning-banner-view');
const templates = require('app/scripts/views/internal/templates');
const { Util } = require('app/scripts/lib/util');
const { Analytics, getScreenFromUrl } = require('@trello/atlassian-analytics');
const { identityBaseUrl, siteDomain } = require('@trello/config');

module.exports = ConfirmEmailBannerView = (function () {
  ConfirmEmailBannerView = class ConfirmEmailBannerView extends (
    WarningBannerView
  ) {
    static initClass() {
      this.prototype.events = {
        'click .js-resend-confirmation-email': 'trackResendEmail',
        'click .js-check-inbox': 'trackCheckInbox',
      };
    }

    initialize() {
      // This updates the daysLeft param for Aa soft email verification
      // without the user doing a hard reload
      this.whenIdle(`confirmEmailBanner_${this.cid}`, () => {
        this.makeDebouncedMethods('updateDaysLeft');
        this.listenTo(Dates, 'renderInterval', this.updateDaysLeftDebounced);
      });

      const knownEmailProviders = {
        gmail: /@(gmail|googlemail).com$/,
        yahoo: /@(yahoo|ymail).com$/,
        live: /@(hotmail|live).com$/,
        mac: /@(me|mac).com$/,
      };

      const emailProviderInboxes = {
        gmail: 'http://gmail.com',
        yahoo: 'http://mail.yahoo.com',
        live: 'http://live.com',
        mac: 'https://www.icloud.com/',
      };

      for (const key in knownEmailProviders) {
        const matcher = knownEmailProviders[key];
        if (matcher.test(this.model.get('email'))) {
          this.emailInboxUrl = emailProviderInboxes[key];
          break;
        }
      }

      if (this.emailInboxUrl == null) {
        return ApiAjax({
          url: '/checkYourEmail',
          data: { email: this.model.get('email') },
          dataType: 'json',
          success: (data) => {
            if (data.error != null) {
              return;
            }
            this.emailInboxUrl = data.url;
            return this.render();
          },
        });
      }
    }

    trackResendEmail(e) {
      return Analytics.sendClickedLinkEvent({
        linkName: 'resendEmailLink',
        source: 'emailVerificationBanner',
      });
    }

    trackCheckInbox(e) {
      return Analytics.sendClickedLinkEvent({
        linkName: 'checkInboxLink',
        source: 'emailVerificationBanner',
      });
    }

    trackForcedLogout() {
      return Analytics.sendTrackEvent({
        action: 'loggedOut',
        actionSubject: 'member',
        source: 'emailVerificationBanner',
      });
    }

    getDaysLeft() {
      // User has 14 days to confirm their account before getting forced logged out
      const daysLeft = 14 - this.getDaysOld();
      return daysLeft;
    }

    getDaysOld() {
      const DAY = 1000 * 60 * 60 * 24;
      const createdDate = Util.idToDate(this.model.get('id'));
      const currentDate = new Date();

      const daysOld = Math.round(
        (currentDate.getTime() - createdDate.getTime()) / DAY,
      );

      return daysOld;
    }

    updateDaysLeft() {
      if (this.model.get('isAaMastered')) {
        const newDaysLeft = this.getDaysLeft();
        if (newDaysLeft === this.model.get('daysLeft')) {
          return this;
        }
        this.model.update('daysLeft', newDaysLeft);
        return this.render();
      }
    }

    render() {
      const data = this.model.toJSON();
      data.isAaMastered = this.model.get('isAaMastered');
      data.aaId = this.model.get('aaId');

      if (this.emailInboxUrl != null) {
        data.emailInboxUrl = this.emailInboxUrl;
        data.knownEmailProvider = true;
      }

      data.daysOld = this.getDaysOld();
      this.model.set('daysOld', data.daysOld);

      if (data.isAaMastered) {
        data.daysLeft = this.getDaysLeft();
        this.model.set('daysLeft', data.daysLeft);

        const returnUrl = window.location.href;
        const continueUrl = `${siteDomain}/auth/atlassian/callback?returnUrl=${returnUrl}`;

        const verifyParams = new URLSearchParams({
          id: data.aaId,
          application: 'trello',
          continue: continueUrl,
        }).toString();

        data.verifyEmailLink = `${identityBaseUrl}/verify-email?${verifyParams}`;

        // Once user hits soft email threshold, they are forced
        // logged out of their account and must then hard email verify
        if (data.daysLeft <= 0) {
          Auth.logoutPost();
          trackForcedLogout();
        }
      }

      Analytics.sendViewedBannerEvent({
        bannerName: 'emailVerificationBanner',
        source: getScreenFromUrl(),
        attributes: {
          daysOld: data.daysOld,
          daysRemaining: data.daysLeft,
          isAaMastered: data.isAaMastered,
        },
      });

      this.$el.html(
        templates.fill(
          require('app/scripts/views/templates/header_warning_banner'),
          data,
        ),
      );

      return this;
    }
  };
  ConfirmEmailBannerView.initClass();
  return ConfirmEmailBannerView;
})();
