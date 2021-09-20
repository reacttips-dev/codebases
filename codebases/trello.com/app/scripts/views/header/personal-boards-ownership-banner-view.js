// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const moment = require('moment');
const { Util } = require('app/scripts/lib/util');
const View = require('app/scripts/views/internal/view');
const template = require('app/scripts/views/templates/header_warning_personal_boards_ownership');
const { Analytics, getScreenFromUrl } = require('@trello/atlassian-analytics');

class PersonalBoardsOwnershipBanner extends View {
  static initClass() {
    this.prototype.className =
      'header-banner mod-warning personal-boards-banner';

    this.prototype.events = {
      'click .js-dismiss-personal-boards-ownership': 'dismiss',
    };
  }

  initialize() {
    this.enterpriseName = this.options.enterpriseName;
    this.ownDate = this.options.ownDate;
    this.idEnterprise = this.options.idEnterprise;
  }

  dismiss(e) {
    Util.stop(e);
    Analytics.sendDismissedComponentEvent({
      componentType: 'banner',
      componentName: 'personalBoardsOwnershipBanner',
      source: getScreenFromUrl(),
      containers: {
        enterprise: {
          id: this.idEnterprise,
        },
      },
    });

    return this.model.dismissPersonalBoardsOwnershipBanner(() => {
      return this.remove();
    });
  }

  render() {
    this.$el.html(
      template({
        enterpriseName: this.enterpriseName,
        date: moment(this.ownDate)
          .locale(this.model.getPref('locale') || 'en')
          .format('LL'),
      }),
    );
    Analytics.sendViewedBannerEvent({
      bannerName: 'personalBoardsOwnershipBanner',
      source: getScreenFromUrl(),
      containers: {
        enterprise: {
          id: this.idEnterprise,
        },
      },
    });

    return this;
  }
}

PersonalBoardsOwnershipBanner.initClass();
module.exports = PersonalBoardsOwnershipBanner;
