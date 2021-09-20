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
const BoardSelectOrganizationView = require('app/scripts/views/board-menu/board-select-organization-view');
const ChangeBoardAddMemberPermsView = require('app/scripts/views/board-menu/change-board-add-member-perms-view');
const ChangeBoardCommentingPermsView = require('app/scripts/views/board-menu/change-board-commenting-perms-view');
const ChangeBoardVotingPermsView = require('app/scripts/views/power-ups/voting-settings-view');
const { Util } = require('app/scripts/lib/util');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const View = require('app/scripts/views/internal/view');
const templates = require('app/scripts/views/internal/templates');
const { l } = require('app/scripts/lib/localize');
const { Analytics, tracingCallback } = require('@trello/atlassian-analytics');
const { featureFlagClient } = require('@trello/feature-flag-client');
const React = require('react');
const ReactDOM = require('@trello/react-dom-wrapper');
const {
  WorkspacesPreambleChangeTeamButton,
} = require('app/src/components/WorkspacesPreamble');
const { renderComponent } = require('app/src/components/ComponentWrapper');

class BoardSettingsView extends View {
  static initClass() {
    this.prototype.viewTitleKey = 'settings';

    this.prototype.className = 'board-menu-content-frame';

    this.prototype.events = {
      'click .js-change-org:not(.disabled)': 'changeOrg',

      'click .js-toggle-covers:not(.disabled)': 'toggleCovers',

      'click .js-change-comments:not(.disabled)': 'changeCommentingPerms',
      'click .js-change-voting:not(.disabled)': 'changeVotingPerms',
      'click .js-change-add-members:not(.disabled)': 'changeAddMemberPerms',

      'click .js-toggle-org-mem-join:not(.disabled)': 'toggleSelfJoin',

      'click .js-change-cookie-settings': 'changeCookieSettings',
    };
  }

  initialize({ sidebarView }) {
    this.sidebarView = sidebarView;
    this.makeDebouncedMethods('render');

    this.listenTo(this.model, 'change', this.renderDebounced);

    this.blockTeamlessBoardsEnabled = featureFlagClient.get(
      'btg.block-teamless-boards',
      false,
    );
    this.workspacesPreambleChangeTeamButtonTarget = null;
  }

  render() {
    const data = this.model.toJSON({ prefs: true, url: true, labels: true });

    data.isLoggedIn = Auth.isLoggedIn();

    data.cardCovers = data.prefs.cardCovers;
    const organization = this.model.getOrganization();
    data.orgDisplayName =
      organization != null ? organization.get('displayName') : undefined;
    data.hasOrg = (organization != null ? organization.id : undefined) != null;

    data.votingEnabled = this.model.isPowerUpEnabled('voting');
    data.commentsDisplay = l(['board pref perms', this.model.getCommentPerm()]);
    data.votingDisplay = l(['board pref perms', this.model.getPref('voting')]);
    data.invitationsDisplay = l([
      'board pref perms',
      this.model.getInvitePerm(),
    ]);

    data.blockTeamlessBoardsEnabled = this.blockTeamlessBoardsEnabled;

    if (this.blockTeamlessBoardsEnabled) {
      // Only board owners can change the org
      // Non board owners can no longer make a board teamless
      data.canChangeOrg = this.model.owned();
    } else {
      // If you're the org owner, you can change the organization to nothing
      // If you're the board owner, you can change the organization to whatever
      data.canChangeOrg =
        (organization != null ? organization.owned() : undefined) ||
        this.model.owned();
      data.setOrgNull =
        (organization != null ? organization.owned() : undefined) &&
        !this.model.owned();
    }

    data.isTemplate = this.model.isTemplate();

    this.$el.html(
      templates.fill(
        require('app/scripts/views/templates/board_menu_settings'),
        data,
        { editable: this.model.editable(), owned: this.model.owned() },
      ),
    );

    if (this.blockTeamlessBoardsEnabled) {
      this.renderWorkspacesPreambleChangeTeamButton();
    }

    return this;
  }

  changeOrg(e) {
    Util.stop(e);

    if (this.model.owned()) {
      PopOver.toggle({
        elem: $(e.target).closest('a'),
        view: BoardSelectOrganizationView,
        options: { model: this.model, modelCache: this.modelCache },
      });

      this.sidebarView.sendClickedDrawerNavItemEvent('settings', 'changeOrg');
    } else {
      const traceId = Analytics.startTask({
        taskName: 'edit-board/idOrganization',
        source: 'boardMenuDrawerSettingsScreen',
      });
      const idOrg = this.model.get('idOrganization');
      this.modelCache.get('Organization', idOrg)?.boardList.remove(this.model);
      const data = {
        idOrganization: '',
        traceId,
      };
      this.model.update(
        data,
        tracingCallback(
          {
            taskName: 'edit-board/idOrganization',
            source: 'boardMenuDrawerSettingsScreen',
            traceId,
          },
          (err) => {
            if (!err) {
              Analytics.sendUpdatedBoardFieldEvent({
                field: 'organization',
                source: 'boardMenuDrawerSettingsScreen',
                containers: {
                  board: {
                    id: this.model.id,
                  },
                },
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
      this.sidebarView.sendClickedDrawerNavItemEvent('settings', 'removeOrg');
    }
  }

  toggleCovers(e, cardCovers) {
    Util.stop(e);
    const traceId = Analytics.startTask({
      taskName: 'edit-board/prefs/cardCovers',
      source: 'boardMenuDrawerSettingsScreen',
    });
    this.sidebarView.sendClickedDrawerNavItemEvent('settings', 'cardCovers', {
      cardCoversEnabled: this.model.getPref('cardCovers'),
      taskId: traceId,
    });
    this.model.setPrefWithTracing(
      'cardCovers',
      !this.model.getPref('cardCovers'),
      {
        taskName: 'edit-board/prefs/cardCovers',
        source: 'boardMenuDrawerSettingsScreen',
        traceId,
        next: (err) => {
          if (!err) {
            Analytics.sendUpdatedBoardFieldEvent({
              field: 'cardCoversPref',
              value: this.model.getPref('cardCovers'),
              source: 'boardMenuDrawerSettingsScreen',
              containers: {
                board: {
                  id: this.model.id,
                },
                organization: {
                  id: this.model.getOrganization()?.id,
                },
              },
              attributes: {
                taskId: traceId,
              },
            });
          }
        },
      },
    );
  }

  changeCommentingPerms(e) {
    Util.stop(e);

    PopOver.toggle({
      elem: $(e.target).closest('a'),
      view: new ChangeBoardCommentingPermsView({
        model: this.model,
        modelCache: this.modelCache,
      }),
    });

    this.sidebarView.sendClickedDrawerNavItemEvent('settings', 'commentPerms');
  }

  changeVotingPerms(e) {
    Util.stop(e);

    PopOver.toggle({
      elem: $(e.target).closest('a'),
      view: new ChangeBoardVotingPermsView({
        model: this.model,
        modelCache: this.modelCache,
      }),
    });

    this.sidebarView.sendClickedDrawerNavItemEvent('settings', 'votingPerms');
  }

  changeAddMemberPerms(e) {
    Util.stop(e);

    PopOver.toggle({
      elem: $(e.target).closest('a'),
      view: new ChangeBoardAddMemberPermsView({
        model: this.model,
        modelCache: this.modelCache,
      }),
    });

    this.sidebarView.sendClickedDrawerNavItemEvent(
      'settings',
      'invitationsPerms',
      { invitationsEnabled: this.model.getPref('invitations') },
    );
  }

  toggleSelfJoin(e) {
    Util.stop(e);
    const traceId = Analytics.startTask({
      taskName: 'edit-board/prefs/selfJoin',
      source: 'boardMenuDrawerSettingsScreen',
    });
    this.sidebarView.sendClickedDrawerNavItemEvent('settings', 'selfJoin', {
      selfJoinEnabled: this.model.getPref('selfJoin'),
      taskId: traceId,
    });
    this.model
      .setPrefWithTracing('selfJoin', !this.model.getPref('selfJoin'), {
        taskName: 'edit-board/prefs/selfJoin',
        source: 'boardMenuDrawerSettingsScreen',
        traceId,
        next: (err) => {
          if (!err) {
            Analytics.sendUpdatedBoardFieldEvent({
              field: 'selfJoinPref',
              value: this.model.getPref('selfJoin'),
              source: 'boardMenuDrawerSettingsScreen',
              containers: {
                board: {
                  id: this.model.id,
                },
                organization: {
                  id: this.model.getOrganization()?.id,
                },
              },
              attributes: {
                taskId: traceId,
              },
            });
          }
        },
      })
      .save();
  }

  changeCookieSettings() {
    this.sidebarView.sendClickedDrawerNavItemEvent('settings', 'cookieConsent');
    return window.trelloCookieConsentDialog();
  }

  unmountWorkspacesPreambleChangeTeamButton() {
    if (this.workspacesPreambleChangeTeamButtonTarget) {
      return ReactDOM.unmountComponentAtNode(
        this.workspacesPreambleChangeTeamButtonTarget,
      );
    }
  }

  renderWorkspacesPreambleChangeTeamButton() {
    this.unmountWorkspacesPreambleChangeTeamButton();
    this.workspacesPreambleChangeTeamButtonTarget = this.$(
      '#board-settings-change-org',
    )[0];

    if (this.workspacesPreambleChangeTeamButtonTarget) {
      renderComponent(
        <WorkspacesPreambleChangeTeamButton boardId={this.model.id} />,
        this.workspacesPreambleChangeTeamButtonTarget,
      );
    }
  }

  remove() {
    this.unmountWorkspacesPreambleChangeTeamButton();
    return super.remove(...arguments);
  }
}

BoardSettingsView.initClass();
module.exports = BoardSettingsView;
