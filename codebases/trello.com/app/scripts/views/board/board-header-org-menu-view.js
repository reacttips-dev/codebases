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
const { Auth } = require('app/scripts/db/auth');
const BoardSelectOrganizationView = require('app/scripts/views/board-menu/board-select-organization-view');
const { Util } = require('app/scripts/lib/util');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const View = require('app/scripts/views/internal/view');
const popoverBoardHeaderOrgMenu = require('app/scripts/views/templates/popover_board_header_org_menu');
const { dontUpsell } = require('@trello/browser');
const { featureFlagClient } = require('@trello/feature-flag-client');
const { Analytics, tracingCallback } = require('@trello/atlassian-analytics');
const React = require('react');
const { renderComponent } = require('app/src/components/ComponentWrapper');
const {
  BoardHeaderOrgMenuPopoverButton,
} = require('app/src/components/UpgradePathAudit/');

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}

class BoardHeaderOrgMenuView extends View {
  static initClass() {
    this.prototype.events = {
      'click .js-change-org': 'openChangeOrg',
      'click .js-view-org': 'viewOrg',
    };
  }

  initialize() {
    super.initialize(...arguments);

    this.makeDebouncedMethods('render');

    const org = this.model.getOrganization();

    if (org) {
      this.listenTo(org, {
        'change:products': this.renderDebounced,
      });
    }
  }

  getViewTitle() {
    return this.model.getOrganization().get('displayName');
  }

  render() {
    const org = this.model.getOrganization();

    const data = org.toJSON();

    const blockTeamlessBoardsEnabled = featureFlagClient.get(
      'btg.block-teamless-boards',
      false,
    );

    const repackagingGTMEnabled = featureFlagClient.get(
      'nusku.repackaging-gtm.features',
      false,
    );

    if (blockTeamlessBoardsEnabled) {
      // Only board owners can change the org
      // Non board owners can no longer make a board teamless
      data.canChangeOrg = this.model.owned();
    } else {
      // If you're the org owner, you can change the organization to nothing
      // If you're the board owner, you can change the organization to whatever
      data.canChangeOrg =
        (org != null ? org.owned() : undefined) || this.model.owned();
      data.setOrgNull =
        (org != null ? org.owned() : undefined) && !this.model.owned();
    }
    const isPremiumBoard = this.model.isBcBoard();
    const isStandardBoard = this.model.isStandardBoard();
    // org/workspace admins are admins of the workspace and board
    // in this case, the user are not admins of the workspace and board
    const isNotOrgAdmin = !(org.owned() && this.model.owned());

    const isStandardAndNonAdmin = isStandardBoard && isNotOrgAdmin;

    data.skipReactRender =
      isStandardAndNonAdmin || isPremiumBoard || isNotOrgAdmin;
    data.isOrgMember = org.isMember(Auth.me());
    data.blockTeamlessBoardsEnabled = blockTeamlessBoardsEnabled;
    data.repackagingGTMEnabled = repackagingGTMEnabled;
    data.upsellEnabled = !dontUpsell();

    this.$el.html(popoverBoardHeaderOrgMenu(data));

    Analytics.sendScreenEvent({
      name: 'boardWorkspaceInlineDialog',
      containers: {
        board: {
          id: this.model.id,
        },
        organization: {
          id: __guard__(this.model.getOrganization(), (x) => x.id),
        },
      },
    });

    this.renderUpsellComponent(org?.get('id'));

    return this;
  }

  renderUpsellComponent(orgId) {
    const container = this.$('#upgrade-path-react-component')[0];

    if (!orgId || !container) {
      return;
    }

    renderComponent(
      <BoardHeaderOrgMenuPopoverButton orgId={orgId} />,
      container,
    );
  }

  openChangeOrg(e) {
    Util.stop(e);
    if (this.model.owned()) {
      PopOver.pushView({
        view: BoardSelectOrganizationView,
        options: {
          model: this.model,
          modelCache: this.modelCache,
        },
      });

      Analytics.sendClickedLinkEvent({
        linkName: 'changeBoardWorkspaceLink',
        source: 'boardWorkspaceInlineDialog',
        containers: {
          board: {
            id: this.model.id,
          },
          organization: {
            id: __guard__(this.model.getOrganization(), (x) => x.id),
          },
        },
      });
    } else {
      const traceId = Analytics.startTask({
        taskName: 'edit-board/idOrganization',
        source: 'boardWorkspaceInlineDialog',
      });
      const idOrg = this.model.get('idOrganization');
      __guard__(this.modelCache.get('Organization', idOrg), (x1) =>
        x1.boardList.remove(this.model),
      );
      const data = {
        idOrganization: '',
        traceId,
      };
      this.model.update(
        data,
        tracingCallback(
          {
            taskName: 'edit-board/idOrganization',
            source: 'boardWorkspaceInlineDialog',
            traceId,
          },
          (err) => {
            if (!err) {
              Analytics.sendUpdatedBoardFieldEvent({
                field: 'organization',
                source: 'boardWorkspaceInlineDialog',
                containers: {
                  board: {
                    id: this.model.id,
                  },
                  organization: {
                    id: __guard__(this.model.getOrganization(), (x2) => x2.id),
                  },
                }, // Removed, so should be undefined
                attributes: {
                  previous: idOrg,
                  taskId: traceId,
                },
              });
            }
          },
        ),
      );
      PopOver.hide();
    }
  }

  viewOrg() {
    return Analytics.sendClickedLinkEvent({
      linkName: 'viewWorkspaceLink',
      source: 'boardWorkspaceInlineDialog',
      containers: {
        board: {
          id: this.model.id,
        },
        organization: {
          id: __guard__(this.model.getOrganization(), (x) => x.id),
        },
      },
    });
  }
}

BoardHeaderOrgMenuView.initClass();
module.exports = BoardHeaderOrgMenuView;
