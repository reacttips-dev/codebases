/* eslint-disable
    no-undef,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const View = require('app/scripts/views/internal/view');
const templates = require('app/scripts/views/internal/templates');
const MemberMiniProfileView = require('app/scripts/views/member-menu-profile/member-mini-profile-view');
const { Analytics } = require('@trello/atlassian-analytics');
const { featureFlagClient } = require('@trello/feature-flag-client');

class AboutThisBoardAdminListView extends View {
  static initClass() {
    this.prototype.viewTitleKey = 'multi admin list';
  }

  initialize() {
    return this.listenTo(this.model);
  }

  render() {
    const data = this.model.toJSON();

    if (featureFlagClient.get('dataeng.gasv3-event-tracking', false)) {
      Analytics.sendScreenEvent({
        name: 'aboutThisBoardAdminListInlineDialog',
        containers: {
          board: {
            id: this.model.id,
          },
        },
      });
    }

    this.$el.html(
      templates.fill(
        require('app/scripts/views/templates/popover_about_this_board_admin_list'),
        data,
      ),
    );

    this.renderAdminList();

    return this;
  }

  renderAdminList() {
    const $target = this.$('.js-show-all-admins');
    const visibleAdmins = this.model.orderedVisibleAdmins();

    const subviews = Array.from(visibleAdmins).map((admin) =>
      this.subview(MemberMiniProfileView, admin, { board: this.model }),
    );
    return this.ensureSubviews(subviews, $target);
  }
}

AboutThisBoardAdminListView.initClass();
module.exports = AboutThisBoardAdminListView;
