import React, { Component } from 'react';
import { getStore } from '../../stores/get-store';
import { Modal, ModalHeader, ModalContent, ModalFooter } from '../../components/base/Modals';
import { Button } from '../../components/base/Buttons';
import LoadingIndicator from '../../components/base/LoadingIndicator';
import InviteUsers from '../../components/base/InviteUsers';
import { observer } from 'mobx-react';
import { reaction } from 'mobx';
import Alert from '../../components/messaging/Alert';
import { INVITE_TO_WORKSPACE } from '../../constants/AppUrlConstants';
import { OPEN_INVITE_MODAL } from '../../constants/UIEventConstants';
import {
  inviteUsers,
  activateTrialAndInviteUsers,
  startTeamWithUsers,
  getTeamInviteLink
} from '../../modules/services/UserInvitationService';
import {
  createTeamAndShareCollection,
  createTeamAndShareEnvironment
} from '../../modules/services/share-entities/ShareEntitiesService';
import AnalyticsService from '../../modules/services/AnalyticsService';
import dispatchUserAction from '../../modules/pipelines/user-action';
import collabUtils from '../../../collaboration/utils/util';
import { openURL } from '../../../js/electron/ElectronService';
import { fetchEntityRoles, getRolesData } from '../../modules/services/RolesService';
import { onSocketReconnect } from '../../../onboarding/src/common/utils';
import {
  GENERATED,
  LOADING,
  EMPTY,
  ERROR,
  FREE_COLLAB_STARTED
} from '../../constants/InviteLinkStateConstants';

import XPath from '../../components/base/XPaths/XPath';
import UIEventService from '../../services/UIEventService';
import { PERMISSION_DENIED_ERROR } from '../../constants/ShareFlowConstants';
import { fetchPermissions } from '../../modules/services/PermissionsService';
import CopyLink from '../../../onboarding/src/features/WorkspaceOverview/components/Sharing/CopyLink';
import NavigationService from '../../../js/services/NavigationService';
import { VISIBILITY } from '../../constants/WorkspaceVisibilityConstants';
import WorkspaceService from '../../services/WorkspaceService';
import { TEAM_ONBOARDING_IDENTIFIER } from '../../../onboarding/navigation/constants';
import { initiateTeamCreation, FLOW } from '../../../onboarding/src/features/TeamOnboarding/pages/CreatingTeam/index';
import { UPGRADE_PLAN_MODAL } from '../../../onboarding/src/features/Modals/UpgradePlanModal/UpgradePlanModal';
import PluralizeHelper from '../../utils/PluralizeHelper';
import classnames from 'classnames';
import { Icon } from '@postman/aether';
import { openTeamDiscoveryNudgeIfRequired } from '../../../onboarding/src/common/TeamDiscoveryUtil';

const entityModelActionMap = {
    'Collection': createTeamAndShareCollection,
    'Environment': createTeamAndShareEnvironment
  },
  defaultState = {
    isOpen: false,
    isLoading: false,
    inviteLinkState: EMPTY,
    inviteErrorMessage: '',
    collectionId: '',
    workspaceId: '',
    showInviteDeniedError: false,
    isDefaultWorkspace: false,
    isNonTeamPublicWorkspace: false,
    permissions: {},
    disableDefaultWorkspaceAlert: false,
    isFetchingPermissions: true,
    source: '',
    userEmails: [],
    invalidEmails: [],
    tags: []
  };

@observer
export default class InviteModalContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      ...defaultState,
      inviteLink: null
    };

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleMembersChange = this.handleMembersChange.bind(this);
    this.handleInvite = this.handleInvite.bind(this);
    this.handleEmailError = this.handleEmailError.bind(this);
    this.handleGetInviteLink = this.handleGetInviteLink.bind(this);
    this.handleTagsUpdate = this.handleTagsUpdate.bind(this);

    this.renderAlert = this.renderAlert.bind(this);
  }

  UNSAFE_componentWillMount () {
    this.unsubscribeHandler = UIEventService.subscribe(OPEN_INVITE_MODAL, this.handleOpen);
  }

  componentWillUnmount () {
    this.unsubscribeHandler && this.unsubscribeHandler();
  }

  async handleOpen (options = {}) {
    try {
      let currentUser = getStore('CurrentUserStore'),
        activeWorkspace = getStore('ActiveWorkspaceStore'),
        workspaceId = options.workspaceId || activeWorkspace.id,
        workspace;

        try {
          workspace = _.get(await WorkspaceService.fetch({ id: workspaceId }), 'body.data', {});
        }
        catch (e) {}

      // Don't care if the user is a non-signedIn user
      if (!currentUser.isLoggedIn) {
        pm.mediator.trigger('openInviteSignoutModal');
        return;
      }

      AnalyticsService.addEvent('app', 'invite_user_opened', options.source);

      let workspaceName = workspaceId && _.get(getStore('WorkspaceStore').find(workspaceId), 'name', ''),
        isNonTeamPublicWorkspace = _.isUndefined(currentUser.teamId) &&
          _.get(getStore('WorkspaceStore').find(workspaceId), 'visibilityStatus', '') === VISIBILITY.public,
        isDefaultWorkspace = _.get(workspace, 'state.isDefault', false);

      this.setState({
        isOpen: true,
        workspaceId,
        collectionId: options.collection || '',
        environmentId: options.environment || '',
        workspaceName: workspaceName.toUpperCase(),
        isDefaultWorkspace: options.isDefaultWorkspace || isDefaultWorkspace,
        isNonTeamPublicWorkspace,
        disableDefaultWorkspaceAlert: options.disableDefaultWorkspaceAlert || false,
        source: options.source
      });

      getStore('BillingOverviewStore').billingBootstrap();

      this.fetchPermissions();
    }
    catch (e) {
      pm.logger.error(e);
      pm.toasts.error('Something went wrong while inviting the users.');
    }
  }

  async fetchPermissions () {
    let permissions = await fetchPermissions(['manageTeamInvites', 'sendUnapprovedInvites']);

    this.setState({ permissions, isFetchingPermissions: false });
  }

  handleMembersChange ({ members }) {
    this.setState({ members });
  }

  handleClose (membersInvited = false) {
    _.isFunction(this.onOrganizationCreate) && this.onOrganizationCreate();
    _.isFunction(this.teamWorkspaceJoinReaction) && this.teamWorkspaceJoinReaction();

    let team = getStore('CurrentUserStore').team;

    this.openNudgeModalsIfNeeded({
      team,
      membersInvited,
      userEmails: this.state.userEmails
    });

    this.setState(defaultState);
  }

  openNudgeModalsIfNeeded (data) {
    // No need to show any nudge if modal was closed without sending invites or
    // user is not a part of any team
    if (!data.membersInvited || !data.team) {
      return;
    }

    // Need to show upgrade plan modal if true up is not enabled for the team
    if (!_.get(data.team, 'account.true_up_enabled')) {
      const invitesLeft = data.team.pending_invites.length,
        limit = _.get(data, 'team.account.user_addition.limit');

      if (invitesLeft + data.userEmails.length > limit) {
        UIEventService.publish(UPGRADE_PLAN_MODAL, { isOpen: true, members: data.userEmails.length });
      }

      return;
    }

    // Need to show team discovery nudges if the team qualifies for the team discovery experiment
    openTeamDiscoveryNudgeIfRequired();
  }

  // This is used to check if user has entered some tags or not.
  handleTagsUpdate (tags) {
    this.setState({ tags });
  }

  handleChange (field, value) {
      this.setState({ [field]: value });
  }

  handleInviteFlowsError (errorState) {
    let trialStatus = _.get(errorState, 'activate_trial', 0),
        workspaceStatus = _.get(errorState, 'create_workspace', 0);

    if (!trialStatus) {
      this.setState({ isLoading: false });
      pm.toasts.error('Something went wrong while activating the trial');
      return;
    }

    if (!workspaceStatus) {
      this.setState({ isLoading: false });
      pm.toasts.error('Something went wrong while creating the workspace');
      return;
    }
  }

  handleShareEntities (modelType, entityId, attachTeamCreationReaction = true) {
    attachTeamCreationReaction && this.continue();
    let invitedUsers = this.getInvitedUsers();

    initiateTeamCreation(() => {
      return entityModelActionMap[modelType](entityId, invitedUsers)
      .then((response) => {
        const { inviteLink } = response || {};

        this.setState({
          isLoading: attachTeamCreationReaction,
          inviteLink,
          inviteLinkState: FREE_COLLAB_STARTED
        });

        pm.toasts.success(`${modelType} shared with invited users`);
      })
      .catch((e) => {
        pm.logger.error(e);

        this.setState({ isLoading: false });
        pm.toasts.error(_.get(e, 'message', 'Error in inviting users'));
      });
    }, {
      flow: FLOW.INVITE_MEMBERS,
      members: invitedUsers.length
    });
  }

  /**
   * Continue to perform the next action
   */
  async continue () {
    // If no team is there, wait for team to be created
    if (!getStore('CurrentUserStore').team) {
      this.onOrganizationCreate = reaction(
        () => getStore('CurrentUserStore').team,
        () => this.continue()
      );
      return;
    }

    this.setState({
      userEmails: [],
      invalidEmails: [],
      tags: []
    });

    this.handleClose();
  }

  handleContinueSendingInvites ({ workspaceId = null, closeAfterSendingInvites = false } = {}) {
    let team = getStore('CurrentUserStore').team;

    if (!team || _.isEmpty(this.state.userEmails)) {
      // In case the emails in the state are empty then close the modal
      closeAfterSendingInvites ? this.handleClose() : this.continue();
      return;
    }

    let data = {
      workspaceId: workspaceId || this.state.workspaceId,
      emails: this.state.userEmails,
      teamId: team.id
    };

    inviteUsers(data, (err) => {
      if (err) {
        pm.logger.error(err);

        this.setState({ isLoading: false });

        pm.toasts.error(_.get(err, 'message', 'Something went wrong while inviting users'));
        return;
      }

      let refreshOrganizationEvent = {
        name: 'refreshOrganizations',
        namespace: 'user'
      };

      dispatchUserAction(refreshOrganizationEvent)
        .catch((e) => {
          pm.logger.error('Error while refreshing organizations', e);
        });

        closeAfterSendingInvites ? this.handleClose(true) : this.continue();
    });
  }

  getSelectedWorkspace () {
    let selectedWorkspaceId = this.state.workspaceId,
        activeWorkspace = getStore('ActiveWorkspaceStore');

    return selectedWorkspaceId ? getStore('WorkspaceStore').find(selectedWorkspaceId) : activeWorkspace;
  }

  getInvitedUsers () {
    return _.map(this.state.userEmails, (email) => { return { email }; });
  }

  handleErrorResponse (err) {
    pm.logger.error(err);

    let newState = {
      isLoading: false,
      inviteLinkState: EMPTY
    };

    // The user was trying to generate the invite link during which the error came
    if (this.state.inviteLinkState === LOADING) {
      newState = {
        ...newState,
        inviteLinkState: ERROR
      };
    }

    this.setState(newState);

    pm.toasts.error(_.get(err, 'error.message', 'Something went wrong while inviting users'));

    // The error state contains the status of the steps
    // whichever succeeded and failed while activating the trial
    // and inviting users to the workspace
    let errorState = _.get(err, 'error.state', null);
    if (errorState) {
      this.handleInviteFlowsError(errorState);
    }
  }

  handleEmailError ({ showInviteDeniedError }) {
    this.setState({ showInviteDeniedError });
  }

  handleInvite ({ attachTeamCreationReaction = true }) {
    if (!this.canSendInvites()) {
      return;
    }

    // In case the free collab started just now
    // and the user decides to continue
    if (this.state.inviteLinkState === FREE_COLLAB_STARTED) {
      this.setState({ isLoading: true });
      return this.handleContinueSendingInvites();
    }

    let currentUser = getStore('CurrentUserStore');

    // In case the invite link has not been generated
    // then only check if the user has entered emails or not
    if (attachTeamCreationReaction && !this.state.inviteLink && _.isEmpty(this.state.userEmails)) {
      let tags = this.state.tags;

      if (tags.length) {
        AnalyticsService.addEventV2({
          category: 'app',
          action: 'invite_without_add'
        });
      }

      pm.toasts.error('Please add a user');
      return;
    }

    attachTeamCreationReaction && this.setState({ isLoading: true });

    // Opens the invite modal from collection share,
    // Here, we need to invite the users and share the collection at the same time
    if (this.state.collectionId) {
      this.handleShareEntities(
        'Collection',
        this.state.collectionId,
        attachTeamCreationReaction
      );
      return;
    }

    // Opens the invite modal from environment share,
    // Here, we need to invite the users and share the environment at the same time
    if (this.state.environmentId) {
      this.handleShareEntities(
        'Environment',
        this.state.environmentId,
        attachTeamCreationReaction
      );
      return;
    }

    // This means the current active workspace is the default workspace,
    // so you just need to start free collaboration || invite people to team workspace
    if (this.state.isDefaultWorkspace || this.state.isNonTeamPublicWorkspace) {

      // This is a team user trying to invite people
      if (currentUser.teamSyncEnabled) {
        this.handleInviteUsersToTeam();
        return;
      }

      // Or just start the team
      this.handleStartTeam();
      return;
    }

    // Share the workspace which will activate the collaboration
    if (this.getSelectedWorkspace().type === 'personal') {
      this.handleSharePersonalWorkspace();
      return;
    }
  }

  handleStartTeam (attachTeamCreationReaction = true) {
    attachTeamCreationReaction && this.continue();
    AnalyticsService.addEventV2({
      category: 'app',
      action: 'create_team_initiated',
      label: `invitation_${this.state.source}`
    });

    let invitedUser = this.getInvitedUsers();

    initiateTeamCreation(() => {
      return new Promise((resolve, reject) => {
        startTeamWithUsers({ invitations: invitedUser }, (err, response) => {
          if (err) {
            this.handleErrorResponse(err);

            return reject();
          }

          const { inviteLink } = response || {};

          this.setState({
            isLoading: attachTeamCreationReaction,
            inviteLink,
            inviteLinkState: FREE_COLLAB_STARTED
          });

          resolve();
        });
      });
    }, {
      flow: FLOW.INVITE_MEMBERS,
      members: invitedUser.length
    });
  }

  async handleInviteUsersToTeam () {
    this.handleContinueSendingInvites({
      closeAfterSendingInvites: true
    });
  }

  handleSharePersonalWorkspace (attachTeamCreationReaction = true) {
    this.handleShareWorkspace(this.getSelectedWorkspace().id, attachTeamCreationReaction);
  }

  handleShareWorkspace (id, attachTeamCreationReaction = true) {
    if (!id) {
      this.setState({ isLoading: false });
      pm.toasts.success('Kindly provide workspace information to update');
      return;
    }

    let data = {
      workspace: {
        id,
        type: 'team'
      },
      emails: this.state.userEmails
    },
    isTeamUser = getStore('CurrentUserStore').team,
    invitedUser = this.getInvitedUsers();

    // Invite link flow, do not set state for loading
    attachTeamCreationReaction && this.setState({ isLoading: true });

    // Send analytics and attach reaction only for trial activation
    if (!isTeamUser) {

      // Invite link flow, do not attach reaction
      attachTeamCreationReaction && this.continue();
    }

    initiateTeamCreation(() => {
      return new Promise((resolve, reject) => {
        activateTrialAndInviteUsers(data, 'shareWS', (err, response) => {
          if (err) {
            this.handleErrorResponse(err);

            return reject();
          }

          const { inviteLink } = response || {};

          this.setState({
            isLoading: attachTeamCreationReaction,
            inviteLink,
            inviteLinkState: FREE_COLLAB_STARTED
          });

          pm.toasts.success('Successfully invited people to the team');

          // Close this if it is a team user. other wise reaction will take care of the rest.
          if (attachTeamCreationReaction && isTeamUser) {
            this.handleClose();
          }

          resolve();
        });
      });
    }, {
      flow: FLOW.INVITE_MEMBERS,
      members: invitedUser.length
    });
  }

  handleGetInviteLink () {
    // In case the user doesn't have email invite privileges
    if (!this.canSendInvites()) {
      this.setState({
        inviteLinkState: ERROR,
        inviteErrorMessage: PERMISSION_DENIED_ERROR
      });
      return;
    }

    if (this.state.inviteLinkState === LOADING) {
      return;
    }

    this.setState({ inviteLinkState: LOADING });

    if (!getStore('CurrentUserStore').teamSyncEnabled) {
      // In case this is a share collection / environment flow
      // then share it and get the link
      if (this.state.collectionId || this.state.environmentId) {
        // Handle Invite has handling for this flow
        return this.handleInvite({ attachTeamCreationReaction: false });
      }

      return this.state.isDefaultWorkspace || this.state.isNonTeamPublicWorkspace
        ? this.handleStartTeam(false)
        : this.handleSharePersonalWorkspace(false);
    }

    getTeamInviteLink((err, inviteLink) => {
      if (err || !inviteLink) {
        this.setState({
          inviteLinkState: ERROR,
          inviteErrorMessage: _.get(err, 'message', 'Something went wrong while generating the link.')
        });

        return;
      }

      this.setState({ inviteLink, inviteLinkState: GENERATED });
    });
  }

  getCustomStyles () {
    return {
      maxHeight: '150vh',
      marginTop: '60px',
      width: '500px'
    };
  }

  getWarningMessage () {
    const workspaceName = _.get(getStore('WorkspaceStore').find(this.state.workspaceId), 'name', '');

    if (this.state.isDefaultWorkspace === this.state.workspaceId && this.getSelectedWorkspace().type === 'personal' && !this.state.disableDefaultWorkspaceAlert) {
      return `**${workspaceName}** is your own personal space in Postman.
        Invite users to your team to collaborate with them.
        [Learn more](${INVITE_TO_WORKSPACE})`;
    }

    return '';
  }

  getSubText (canManageTeamInvites) {
    if (this.state.showInviteDeniedError) {
      return (
        <div className='invite-user-modal__email-privileges-denied'>
          {PERMISSION_DENIED_ERROR}
        </div>
      );
    }

    return (
      <div className='invite-user-workspace-meta-text'>
        Inviting users will add them to your Postman team, if they’re not already members.
        {!canManageTeamInvites && !this.state.isFetchingPermissions && ' They\'ll join your team once your admin approves.'}
      </div>
    );
  }

  renderAlert () {
    if (this.state.inviteLinkState === ERROR && this.state.inviteErrorMessage) {
      return (
        <Alert
          type='error'
          message={this.state.inviteErrorMessage}
          className='invite-user-modal-alert'
        />
      );
    }

    return false;
  }

  getInviteLink (canSendInvites) {
    if (!this.state.inviteLink || !canSendInvites) {
      return null;
    }

    let link = this.state.inviteLink;
    if (link && !this.state.isDefaultWorkspace && !this.state.isNonTeamPublicWorkspace) {
      link = `${link}&ws=${this.state.workspaceId}`;
    }

    return link;
  }


  getButtonText () {
    if (this.state.isLoading) {
      return <LoadingIndicator className='loading-indicator-size' />;
    }

    if (this.state.inviteLink && this.state.inviteLinkState === LOADING) {
      return 'Continue';
    }

    if ([LOADING, EMPTY, ERROR].includes(this.state.inviteLinkState)) {
      return this.state.isDefaultWorkspace || this.state.isNonTeamPublicWorkspace
        ? 'Invite to team'
        : 'Invite Users';
    }

    return 'Continue';
  }

  /**
   * @method getCurrentInvitesLeft
   * @description Returns number of invites left with the user
   *
   * @returns {Number}
   */
  getCurrentInvitesLeft (team) {
    let invitesLeft;

    if (_.isEmpty(team)) {
      // Subtracting 1 from maxDefaultTeam because the current user is already a part of the team
      invitesLeft = getStore('BillingOverviewStore').maxSizeForDefaultTeam - 1;
    }
    else {
      invitesLeft = getStore('TeamStore').invitesLeft;
    }

    if (this.state.userEmails) {
      invitesLeft = invitesLeft - this.state.userEmails.length;
    }
    return invitesLeft < 0 ? 0 : invitesLeft;
}

  canSendInvites () {
    let canManageTeamInvites = _.get(this.state.permissions, 'manageTeamInvites'),
      canSendUnapprovedInvites = _.get(this.state.permissions, 'sendUnapprovedInvites');

    return canManageTeamInvites || canSendUnapprovedInvites;
  }

  render () {
    let warningMessage = this.getWarningMessage(),
      isSocketConnected = getStore('SyncStatusStore').isSocketConnected,
      canSendInvites = this.canSendInvites(),
      disableButton = !canSendInvites || this.state.isLoading || !isSocketConnected || !_.isEmpty(this.state.invalidEmails) || _.isEmpty(this.state.userEmails),
      canManageTeamInvites = _.get(this.state.permissions, 'manageTeamInvites'),
      buttonTooltipText = !_.isEmpty(this.state.invalidEmails) && 'You have added invalid emails, please remove them to continue.',
      team = getStore('CurrentUserStore').team;

    return (
      <XPath identifier='inviteModal' isVisible={this.state.isOpen}>
        <Modal
          className='invite-user-modal'
          isOpen={this.state.isOpen}
          onRequestClose={() => this.handleClose(false)}
          customStyles={this.getCustomStyles()}
        >
        <ModalHeader className='invite-user-workspace-title'>
          INVITE TO {this.state.isDefaultWorkspace || this.state.isNonTeamPublicWorkspace ? 'TEAM' : this.state.workspaceName }
        </ModalHeader>
        <ModalContent>
          {this.renderAlert()}
          {
            warningMessage &&
              <div className='invite-user-alert-container'>
                <Alert
                  noIcon
                  type='info'
                  message={warningMessage}
                  isDismissable={false}
                />
              </div>
          }
          <div className='create-new-workspace__input-group'>
            <div className='create-new-workspace__input-group__input'>
              <InviteUsers
                disableTeamSuggestions
                hideRoles
                entity='team'
                onAddMember={this.handleMembersChange}
                onRemoveMember={this.handleMembersChange}
                onTagsChange={this.handleTagsUpdate}
                teamStats={this.props.teamStats}
                allowInvites={canSendInvites}
                onChange={this.handleChange}
                handleEmailError={this.handleEmailError}
                canManageTeamInvites={canManageTeamInvites}
              />
            </div>
          </div>
          {this.getSubText(canManageTeamInvites)}
        </ModalContent>
          <ModalFooter>
            <XPath identifier='invite'>
              <Button
                className='button-large invite-team-button'
                type='primary'
                onClick={this.handleInvite}
                disabled={disableButton}
                tooltip={buttonTooltipText}
              >
                {this.getButtonText()}
              </Button>
            </XPath>
            {
              !this.state.inviteLinkState === FREE_COLLAB_STARTED &&
                <Button
                  type='secondary'
                  onClick={() => this.handleClose(false)}
                >
                  Cancel
                </Button>
            }
            {
              (team) &&
              <div className='invite-user-modal__copy-invite-link'>
                <CopyLink canSendInvites={canSendInvites} />
              </div>}
          </ModalFooter>
        </Modal>
      </XPath>
    );
  }
}
