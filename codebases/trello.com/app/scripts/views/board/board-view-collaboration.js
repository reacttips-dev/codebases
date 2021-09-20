// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { Controller } = require('app/scripts/controller');
const React = require('react');
const ReactDOM = require('@trello/react-dom-wrapper');
const { Feature } = require('app/scripts/debug/constants');
const { sendErrorEvent } = require('@trello/error-reporting');

const {
  WorkspacesPreambleBoardHeaderButton,
  WorkspacesPreambleBoardInviteButton,
} = require('app/src/components/WorkspacesPreamble');
const {
  WorkspacesAutoNameAlert,
} = require('app/src/components/WorkspacesAutoNameAlert');
const { renderComponent } = require('app/src/components/ComponentWrapper');

module.exports.unmountWorkspacesAutoNameAlert = function () {
  if (this.workspacesAutoNameAlertTarget) {
    ReactDOM.unmountComponentAtNode(this.workspacesAutoNameAlertTarget);
    this.workspacesAutoNameAlertTarget = null;
  }
};

module.exports.renderWorkspacesAutoNameAlert = function () {
  if (!this.workspacesAutoNameAlertTarget) {
    this.workspacesAutoNameAlertTarget = this.$(
      '#workspaces-auto-name-alert',
    )[0];

    if (this.workspacesAutoNameAlertTarget) {
      try {
        renderComponent(
          <WorkspacesAutoNameAlert orgId={this.model.get('idOrganization')} />,
          this.workspacesAutoNameAlertTarget,
        );
      } catch (err) {
        sendErrorEvent(err, {
          tags: {
            ownershipArea: 'trello-bizteam',
            feature: Feature.WorkspacesAutoNameAlert,
          },
          extraData: {
            component: 'board-view-collaboration',
          },
        });
      }
    }
  }
};

module.exports.unmountWorkspacesPreambleBoardHeaderButton = function () {
  if (this.workspacesPreambleBoardHeaderButtonTarget) {
    ReactDOM.unmountComponentAtNode(
      this.workspacesPreambleBoardHeaderButtonTarget,
    );
    this.workspacesPreambleBoardHeaderButtonTarget = null;
  }
};

module.exports.onWorkspacesPreambleCreateTeamSuccess = function (orgName) {
  if (orgName) {
    return Controller.organizationBoardsView(orgName, {
      shouldShowTeamfulCollaborationPrompt: true,
    }).then(() => this.unmountWorkspacesPreambleBoardHeaderButton());
  }
};

module.exports.renderWorkspacesPreambleBoardHeaderButton = function () {
  this.unmountWorkspacesPreambleBoardHeaderButton();
  this.workspacesPreambleBoardHeaderButtonTarget = this.$(
    '#workspaces-preamble-board-header-button',
  )[0];

  if (this.workspacesPreambleBoardHeaderButtonTarget) {
    renderComponent(
      <WorkspacesPreambleBoardHeaderButton
        boardId={this.model.id}
        canAutoShow={!this.workspacesPreamblePromptHasBeenSeen}
        // eslint-disable-next-line react/jsx-no-bind
        onCreateTeamSuccess={(orgName) =>
          this.onWorkspacesPreambleCreateTeamSuccess(orgName)
        }
        // eslint-disable-next-line react/jsx-no-bind
        onSelectTeamSuccess={(orgId) => this.model.set('idOrganization', orgId)}
      />,
      this.workspacesPreambleBoardHeaderButtonTarget,
    );
    this.workspacesPreamblePromptHasBeenSeen = true;
  }
};

module.exports.unmountWorkspacesPreambleInviteButton = function () {
  if (this.workspacesPreambleInviteButtonTarget) {
    return ReactDOM.unmountComponentAtNode(
      this.workspacesPreambleInviteButtonTarget,
    );
  }
};

module.exports.renderWorkspacesPreambleInviteButton = function () {
  this.unmountWorkspacesPreambleInviteButton();
  this.workspacesPreambleInviteButtonTarget = this.$(
    '#workspaces-preamble-invite-button',
  )[0];

  if (this.workspacesPreambleInviteButtonTarget) {
    renderComponent(
      <WorkspacesPreambleBoardInviteButton
        boardId={this.model.id}
        // eslint-disable-next-line react/jsx-no-bind
        onSuccess={(orgId) => {
          if (orgId) {
            this.model.set('idOrganization', orgId);
          }
          this.hasAddedBoardToTeamViaInviteButton = true;
        }}
      />,
      this.workspacesPreambleInviteButtonTarget,
    );

    if (this.hasAddedBoardToTeamViaInviteButton) {
      this.hasAddedBoardToTeamViaInviteButton = false;
      this.openAddMembers();
    }
  }
};
