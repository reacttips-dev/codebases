// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let SetPasswordBannerView;
const $ = require('jquery');
const { Auth } = require('app/scripts/db/auth');
const ChangeSetPasswordPopoverView = require('app/scripts/views/member/change-set-password-popover-view');
const { Util } = require('app/scripts/lib/util');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const WarningBannerView = require('app/scripts/views/header/warning-banner-view');
const templates = require('app/scripts/views/internal/templates');
const { Analytics, getScreenFromUrl } = require('@trello/atlassian-analytics');

module.exports = SetPasswordBannerView = (function () {
  SetPasswordBannerView = class SetPasswordBannerView extends (
    WarningBannerView
  ) {
    static initClass() {
      this.prototype.events = { 'click .js-change-password': 'changePassword' };
    }
    initialize() {
      this.listenTo(this.model, 'change:loginTypes', () => {
        this.$el.toggle(!Auth.canLogIn());
        return $(window).triggerHandler('resize');
      });
    }

    render() {
      this.$el.html(
        templates.fill(
          require('app/scripts/views/templates/header_warning_password'),
          this.model.toJSON(),
        ),
      );

      Analytics.sendViewedBannerEvent({
        bannerName: 'setPasswordBanner',
        source: getScreenFromUrl(),
      });

      return this;
    }

    changePassword(e) {
      Util.stop(e);
      PopOver.toggle({
        elem: this.$('.js-change-password'),
        view: new ChangeSetPasswordPopoverView({
          model: this.model,
          modelCache: this.modelCache,
        }),
      });
      return Analytics.sendClickedLinkEvent({
        linkName: 'changePasswordLink',
        source: 'setPasswordBanner',
      });
    }
  };
  SetPasswordBannerView.initClass();
  return SetPasswordBannerView;
})();
