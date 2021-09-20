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
const $ = require('jquery');
const { Controller } = require('app/scripts/controller');
const { Util } = require('app/scripts/lib/util');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const View = require('app/scripts/views/internal/view');
const templates = require('app/scripts/views/internal/templates');
const boardMenuVisTemplate = require('app/scripts/views/templates/board_menu_vis');
const { Analytics, tracingCallback } = require('@trello/atlassian-analytics');

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}

class BoardOrgSelectPermLevelView extends View {
  static initClass() {
    this.prototype.viewTitleKey = 'change visibility';

    this.prototype.tagName = 'ul';

    this.prototype.events = { 'click .js-select': 'selectVis' };

    this.prototype.className = 'pop-over-list';
  }

  render() {
    const org = this.options.organization;

    if (
      !org.canSetVisibility('private') &&
      !org.canSetVisibility('org') &&
      !org.canSetVisibility('enterprise') &&
      !org.canSetVisibility('public')
    ) {
      const data = {
        isOrgAdmin: org.owned(),
        orgSettingsUrl: Controller.getOrganizationAccountUrl(org),
        organization: org.toJSON(),
      };
      this.$el.html(
        templates.fill(
          require('app/scripts/views/templates/cant_add_board_to_org'),
          data,
        ),
      );
    } else {
      const current = this.model.getPref('permissionLevel');
      const enterprise = org != null ? org.getEnterprise() : undefined;

      this.$el.html(
        boardMenuVisTemplate({
          current,
          canChange: true,
          mustChange: !org.canSetVisibility(current),
          hasSuperAdmins: org.hasPremiumFeature('superAdmins'),
          hasOrg: true,
          orgName: org.get('displayName'),
          privateRestricted: !org.canSetVisibility('private'),
          orgRestricted: !org.canSetVisibility('org'),
          enterpriseRestricted: !org.canSetVisibility('enterprise'),
          publicRestricted: !org.canSetVisibility('public'),
          hasEnterprise:
            org != null ? org.belongsToRealEnterprise() : undefined,
          enterpriseName:
            enterprise != null ? enterprise.get('displayName') : undefined,
          isTemplate: this.model.isTemplate(),
          isOrgPremium: org != null ? org.isPremium() : undefined,
        }),
      );
    }

    return this;
  }

  selectVis(e) {
    Util.stop(e);

    const $target = $(e.target).closest('.js-select');

    if (
      $target.hasClass('disabled') ||
      $target.closest('.js-disabled').length
    ) {
      return;
    }

    const traceId = Analytics.startTask({
      taskName: 'edit-board/idOrganization',
      source: 'boardOrgSelectPermLevelInlineDialog',
    });

    const setting = $target.attr('name');

    if (this.options.idOrganizationSource) {
      __guard__(
        this.modelCache.get('Organization', this.options.idOrganizationSource),
        (x) => x.boardList.remove(this.model),
      );
    }
    this.model.update(
      {
        traceId,
        idOrganization: this.options.organization.id,
        'prefs/permissionLevel': setting,
      },
      tracingCallback({
        taskName: 'edit-board/idOrganization',
        source: 'boardOrgSelectPermLevelInlineDialog',
        traceId,
      }),
    );
    this.options.organization.boardList.add(this.model);

    return PopOver.hide();
  }
}

BoardOrgSelectPermLevelView.initClass();
module.exports = BoardOrgSelectPermLevelView;
