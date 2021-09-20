/* eslint-disable
    eqeqeq,
    @typescript-eslint/no-use-before-define,
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
let BoardMemberMenuView;
const React = require('react');
const { renderComponent } = require('app/src/components/ComponentWrapper');
const AddMemberToTeamView = require('app/scripts/views/member/add-to-team-popover-view');
const { Analytics, tracingCallback } = require('@trello/atlassian-analytics');
const Alerts = require('app/scripts/views/lib/alerts');
const { Auth } = require('app/scripts/db/auth');
const ChangeRolePopoverView = require('app/scripts/views/member/change-role-popover-view');
const Confirm = require('app/scripts/views/lib/confirm');
const { Controller } = require('app/scripts/controller');
const MemberMiniProfileView = require('app/scripts/views/member-menu-profile/member-mini-profile-view');
const { Util } = require('app/scripts/lib/util');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const $ = require('jquery');
const _ = require('underscore');
const { l } = require('app/scripts/lib/localize');
const { sendErrorEvent } = require('@trello/error-reporting');
const templates = require('app/scripts/views/internal/templates');
const {
  maybeDisplayOrgMemberLimitsError,
} = require('app/scripts/views/organization/member-limits-error');
const { dontUpsell } = require('@trello/browser');
const { navigate } = require('app/scripts/controller/navigate');
const {
  FacePileLinkButton,
} = require('app/src/components/UpgradePathAudit/FacePileLinkButton');

module.exports = BoardMemberMenuView = (function () {
  BoardMemberMenuView = class BoardMemberMenuView extends (
    MemberMiniProfileView
  ) {
    static initClass() {
      this.prototype.className = 'board-member-menu';

      this.prototype.events = {
        'click .js-remove-member': 'removeMember',
        'click .js-add-to-team': 'addMemberToTeam',
        'click .js-add-to-team a': 'addMemberToTeamUpgrade',
        'click .js-change-role': 'changeRole',
        'click .js-view-member-activity': 'viewMemberActivity',
      };
    }

    initialize() {
      this.board = this.options.board;
      this.org = this.board.getOrganization();

      // If invitations permissions change while menu is open, rerender menu
      // as remove permissions may have changed
      this.listenTo(this.board, 'change:prefs', this.render);

      // Re-render the popover to account for any product changes
      if (this.org) {
        this.listenTo(this.org, 'change:products', this.render);
      }

      return super.initialize(...arguments);
    }

    addMemberToTeamUpgrade(e) {
      e.stopPropagation();
      if (!dontUpsell()) {
        e.preventDefault();
        return navigate(e.target.pathname, { trigger: true });
      }
    }

    renderMenu() {
      const data = _.extend(
        this.model.toJSON(),
        typeof this.board.premiumFeatures === 'function'
          ? this.board.premiumFeatures()
          : undefined,
        this.model.getMembershipData(this.board),
      );

      const org = this.board.getOrganization();

      data.boardProfileUrl = Controller.getMemberBoardProfileUrl(
        this.model.get('username'),
        this.board.id,
      );

      const memberType = this.board.getMemberType(this.model, {
        ignoreEntAdminStatus: true,
      });
      data.canInviteMemberToTeam = org && this.canInviteMemberToTeam(org);
      data.isGhost = memberType === 'virtual';
      data.type = l(['member types', memberType]);
      data.isTemplate = this.board.isTemplate();
      data.isFreeTeam = org && !org.isPremium();
      data.orgBillingUrl =
        (org != null ? org.get('name') : undefined) &&
        (org != null ? org.getBillingUrl() : undefined);
      data.orgId = org != null ? org.get('id') : undefined;

      if (['superadmin', 'deactivated'].includes(memberType)) {
        data.canChangeRole = false;
      }

      this.$el.append(
        templates.fillMenu(
          require('app/scripts/views/templates/member_on_board_menu'),
          data,
          { editable: this.board.editable(), owned: this.board.owned() },
        ),
      );

      this.renderUpsellLinkButton(org != null ? org.get('id') : undefined);

      return this;
    }

    renderUpsellLinkButton(orgId) {
      const container = this.$('.for-more-roles-react-component')[0];

      if (!orgId || !container) {
        return;
      }

      return renderComponent(<FacePileLinkButton orgId={orgId} />, container);
    }

    viewMemberActivity() {
      return PopOver.hide();
    }

    canInviteMemberToTeam(org) {
      if (org.hasActiveMembership(this.model)) {
        return false;
      }

      const me = Auth.me();
      const isTeamAdmin = org.ownedByMember(me);

      const isEnterprise = org.belongsToRealEnterprise();

      const idEnterprise = org.get('idEnterprise');
      const isEnterpriseAdmin =
        __guard__(me.get('idEnterprisesAdmin'), (x) =>
          x.indexOf(idEnterprise),
        ) >= 0;

      return isTeamAdmin || (isEnterprise && isEnterpriseAdmin);
    }

    changeRole(e) {
      Util.stop(e);
      PopOver.pushView({
        view: new ChangeRolePopoverView({
          model: this.model,
          parent: this.board,
          modelCache: this.modelCache,
        }),
      });
    }

    removeMember(e, options) {
      Util.stop(e);
      const me = Auth.me();

      return Confirm.pushView(
        this.model.removeMembershipConfirmationKey(this.board),
        {
          confirmBtnClass: 'nch-button nch-button--danger',
          fxConfirm: (e) => {
            const traceId = Analytics.startTask({
              taskName: 'edit-board/members/remove',
              source: 'boardMemberInlineDialog',
            });

            this.board.removeMemberWithTracing(
              this.model,
              traceId,
              tracingCallback(
                {
                  taskName: 'edit-board/members/remove',
                  source: 'boardMemberInlineDialog',
                  traceId,
                },
                (error, response) => {
                  if (response) {
                    Analytics.sendTrackEvent({
                      action: this.model === me ? 'left' : 'removed',
                      actionSubject: this.model === me ? 'board' : 'member',
                      source: 'boardMemberInlineDialog',
                      containers: {
                        board: {
                          id: this.board.id,
                        },
                      },
                      attributes: {
                        taskId: traceId,
                      },
                    });
                  }
                },
              ),
            );
            return PopOver.hide();
          },
        },
      );
    }

    showError(message) {
      sendErrorEvent(new Error(`Unknown server error message '${message}'`));
      const errorMessage = l(['server error', 'unknown']);
      return Alerts.showLiteralText(errorMessage, 'error', 'addToTeam', 5000);
    }

    addMemberToTeam(e, options) {
      Util.stop(e);

      const org = this.board.getOrganization();

      const isEnterprise = org.belongsToRealEnterprise();
      const isBC = org.isBusinessClass();
      const isStandard = org.isStandard();

      if (isEnterprise || isBC || isStandard) {
        PopOver.pushView({
          // limits are checked in AddMemberToTeamView
          view: new AddMemberToTeamView({
            isBC,
            isStandard,
            isEnterprise,
            model: this.model,
            org,
          }),
        });
      } else {
        if (maybeDisplayOrgMemberLimitsError($(e.target), org, this.model)) {
          return;
        }

        org
          .addMember(this.model)
          .then(() => {
            return PopOver.hide();
          })
          .catch((err) => {
            this.showError(err.message);
            return PopOver.hide();
          });
      }
    }
  };
  BoardMemberMenuView.initClass();
  return BoardMemberMenuView;
})();

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}
