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
const { Analytics } = require('@trello/atlassian-analytics');
const BoardSelectOrganizationForPermChangeView = require('app/scripts/views/board-menu/board-select-organization-for-perm-change-view');
const ConfirmationPublicBoardsView = require('app/scripts/views/board/confirmation-public-boards-view');
const { Util } = require('app/scripts/lib/util');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const View = require('app/scripts/views/internal/view');
const boardMenuVisTemplate = require('app/scripts/views/templates/board_menu_vis');

class ChangeBoardVisibilityView extends View {
  static initClass() {
    this.prototype.tagName = 'ul';

    this.prototype.className = 'pop-over-list';

    this.prototype.maxWidth = 370;

    this.prototype.events = { 'click .js-select': 'selectVis' };
  }
  viewTitleKey() {
    if (this.model.owned()) {
      return 'change visibility';
    } else {
      return 'visibility';
    }
  }

  initialize() {
    this.listenTo(this.model, 'change', this.render);
  }

  render() {
    const org = this.model.getOrganization();
    const enterprise = org != null ? org.getEnterprise() : undefined;

    this.$el.html(
      boardMenuVisTemplate({
        canChange: this.model.owned(),
        current: this.model.getPref('permissionLevel'),
        hasSuperAdmins: org?.hasPremiumFeature('superAdmins') || false,
        hasOrg: org != null,
        orgName: org != null ? org.get('displayName') : undefined,
        privateRestricted: !this.model.canSetVisibility('private'),
        orgRestricted:
          org != null &&
          !(org != null ? org.canSetVisibility('org') : undefined),
        enterpriseRestricted:
          org != null &&
          !(org != null ? org.canSetVisibility('enterprise') : undefined),
        publicRestricted: !this.model.canSetVisibility('public'),
        hasEnterprise: org != null ? org.belongsToRealEnterprise() : undefined,
        enterpriseName:
          enterprise != null ? enterprise.get('displayName') : undefined,
        isTemplate: this.model.isTemplate(),
        isOrgPremium: org != null ? org.isPremium() : undefined,
      }),
    );

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

    const setting = $target.attr('name');
    if (setting === 'public') {
      PopOver.pushView({
        elem: e.target,
        view: new ConfirmationPublicBoardsView({
          model: this.model,
          modelCache: this.modelCache,
        }),
        maxWidth: 370,
      });

      return;
    }

    if (setting === 'org' && !this.model.getOrganization()) {
      // show org picker
      PopOver.pushView({
        view: BoardSelectOrganizationForPermChangeView,
        options: {
          model: this.model,
          modelCache: this.modelCache,
          disableNone: true,
        },
      });
      return;
    }

    const traceId = Analytics.startTask({
      taskName: 'edit-board/prefs/permissionLevel',
      source: 'changeBoardVisibilityInlineDialog',
    });

    const previous = this.model.getPref('permissionLevel');

    this.model.setPrefWithTracing('permissionLevel', setting, {
      taskName: 'edit-board/prefs/permissionLevel',
      source: 'changeBoardVisibilityInlineDialog',
      traceId,
      next: (_err, res) => {
        if (res) {
          Analytics.sendUpdatedBoardFieldEvent({
            field: 'visibility',
            value: setting,
            source: 'changeBoardVisibilityInlineDialog',
            containers: {
              board: {
                id: this.model.id,
              },
              organization: {
                id: this.model.getOrganization()?.id,
              },
            },
            attributes: {
              change: previous !== setting,
              previous,
              taskId: traceId,
            },
          });
        }
      },
    });
    this.model.save();

    PopOver.popView();
  }
}

ChangeBoardVisibilityView.initClass();
module.exports = ChangeBoardVisibilityView;
