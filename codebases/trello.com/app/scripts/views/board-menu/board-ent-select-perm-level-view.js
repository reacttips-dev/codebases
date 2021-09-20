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
const { Auth } = require('app/scripts/db/auth');
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

class BoardEntSelectPermLevelView extends View {
  static initClass() {
    this.prototype.viewTitleKey = 'change visibility';

    this.prototype.tagName = 'ul';

    this.prototype.events = { 'click .js-select': 'selectVis' };

    this.prototype.className = 'pop-over-list';
  }

  render() {
    const enterprise = this.options.enterprise;

    if (
      !enterprise.canSetTeamlessBoardVisibility('private') &&
      !enterprise.canSetTeamlessBoardVisibility('public')
    ) {
      const data = {
        isEntAdmin: enterprise.isAdmin(Auth.me()),
        entSettingsUrl: Controller.getEnterpriseAdminDashboardUrl(
          enterprise,
          'settings',
        ),
        enterprise: enterprise.toJSON(),
      };
      this.$el.html(
        templates.fill(
          require('app/scripts/views/templates/cant_add_board_to_ent'),
          data,
        ),
      );
    } else {
      const current = this.model.getPref('permissionLevel');

      this.$el.html(
        boardMenuVisTemplate({
          current,
          canChange: true,
          mustChange: !enterprise.canSetTeamlessBoardVisibility(current),
          hasOrg: false,
          hasSuperAdmins: false,
          privateRestricted: !enterprise.canSetTeamlessBoardVisibility(
            'private',
          ),
          orgRestricted: true,
          enterpriseRestricted: true,
          publicRestricted: !enterprise.canSetTeamlessBoardVisibility('public'),
          hasEnterprise: true,
          enterpriseName: enterprise.get('displayName'),
          isTemplate: this.model.isTemplate(),
          isOrgPremium: false,
          isTeamlessOwnedBoard: true,
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
      source: 'boardEntSelectPermLevelInlineDialog',
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
        idOrganization: null,
        'prefs/permissionLevel': setting,
      },
      tracingCallback({
        taskName: 'edit-board/idOrganization',
        source: 'boardEntSelectPermLevelInlineDialog',
        traceId,
      }),
    );

    return PopOver.hide();
  }
}

BoardEntSelectPermLevelView.initClass();
module.exports = BoardEntSelectPermLevelView;
