import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Icon } from '@postman/aether';
import NavigationService from '../../../../js/services/NavigationService';

import { Dropdown, DropdownButton, DropdownMenu, MenuItem } from '../../../../js/components/base/Dropdowns';
import { Button } from '../../../../js/components/base/Buttons';
import Text from '../../../../js/components/base/Text';
import { getStore } from '../../../../js/stores/get-store';
import { fetchEntityRoles, getRolesData } from '../../../../js/modules/services/RolesService';
import WorkspaceService from '../../../../js/services/WorkspaceService';
import LoadingIndicator from '../../../../js/components/base/LoadingIndicator';
import { ERROR_STATES, VISIBILITY, VISIBILITY_STATES } from '../../../../js/constants/WorkspaceVisibilityConstants';
import dispatchUserAction from '../../../../js/modules/pipelines/user-action';
import { fetchPermissions } from '../../../../collaboration/services/PermissionService';
import utils from '../../../../js/utils/util';
import collabUtils from '../../../../collaboration/utils/util';
import { CREATE_WORKSPACE_URL } from '../../../../collaboration/navigation/constants';
import AnalyticsService from '../../../../js/modules/services/AnalyticsService';
import { reaction } from 'mobx';
import { TEAM_ENTITY_TYPE } from '../../../../js/constants/ShareFlowConstants';
import RequestToActionService from '../../../../collaboration/services/RequestToActionService';
import { generateSearchParamsFromObject } from '../../../../collaboration/services/utils/util';
import WorkspaceSwitchService from '../../../../js/services/WorkspaceSwitchService';
import { ACTION_REQUEST_ACTIONS, ACTION_REQUEST_ERROR_STATES, ACTION_REQUEST_STATES } from '../../../../collaboration/constants/actionRequests';
import { TEAM_ONBOARDING_IDENTIFIER, HOME_IDENTIFIER } from '../../../../onboarding/navigation/constants';

@observer
class WorkspaceVisibilitySelector extends Component {
  constructor (props) {
    super(props);

    this.state = {
      visibilityStatus: props.createMode ?
        VISIBILITY.team :
        getStore('ActiveWorkspaceStore').visibilityStatus || VISIBILITY.onlyMe,
      teamCurrentRole: props.teamCurrentRole || {},
      loading: false,
      rolesList: [],
      pendingRequests: [],
      groupCurrentRoles: {},
      userCurrentRoles: {},
      orderedRoleList: [],
      permissions: [],
      error: null
    };

    this.renderPendingRequestBanner = this.renderPendingRequestBanner.bind(this);
    this.isPrimaryButtonDisabled = this.isPrimaryButtonDisabled.bind(this);
    this.handleChangeVisibility = this.handleChangeVisibility.bind(this);
    this.makeTeamProfilePublic = this.makeTeamProfilePublic.bind(this);
    this.makeUserProfilePublic = this.makeUserProfilePublic.bind(this);
    this.fetchPendingRequests = this.fetchPendingRequests.bind(this);
    this.handleChangeRole = this.handleChangeRole.bind(this);
    this.fetchPermissions = this.fetchPermissions.bind(this);
    this.handleRequest = this.handleRequest.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.updateState = this.updateState.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.fetchRoles = this.fetchRoles.bind(this);
    this.handleCancelCreateTeam = this.handleCancelCreateTeam.bind(this);
  }

  componentDidMount () {
    this.fetchPermissions();

    this.teamReaction = reaction(() => getStore('CurrentUserStore').teamId, (teamId) => {
      if (teamId) {
        this.fetchRoles();
        !this.props.createMode && this.fetchPendingRequests();

        _.isFunction(this.teamReaction) && this.teamReaction();
      }
    }, { fireImmediately: true });

    if (!this.props.createMode) {
      this.props.defaultWsVisibility
        ? this.setState({ visibilityStatus: this.props.defaultWsVisibility })
        : this.visibilityReaction = reaction(() => getStore('ActiveWorkspaceStore').visibilityStatus, (visibilityStatus) => {
          this.setState({ visibilityStatus });
        });
    }
  }

  componentDidUpdate (prevProps) {
    if (prevProps.teamCurrentRole !== this.props.teamCurrentRole) {
      this.updateState('teamCurrentRole', this.props.teamCurrentRole);
    }
  }

  componentWillUnmount () {
    _.isFunction(this.visibilityReaction) && this.visibilityReaction();
  }

  handleChangeVisibility (visibilityStatus) {
    const teamCurrentRole = (visibilityStatus === VISIBILITY.team || visibilityStatus === VISIBILITY.public)
      ? _.isEmpty(this.state.teamCurrentRole)
        ? this.state.teamDefaultRole
        : this.state.teamCurrentRole
      : {},
      groupCurrentRoles = visibilityStatus === VISIBILITY.public ? this.state.groupCurrentRoles : {};

    this.setState({
      visibilityStatus,
      teamCurrentRole,
      groupCurrentRoles,
      error: null
    });

    AnalyticsService.addEventV2({
      category: 'workspace',
      action: 'change_visibility',
      label: visibilityStatus
    });

    !this.props.showFooterActions && _.isFunction(this.props.onChangeVisibility)
    && this.props.onChangeVisibility(visibilityStatus, teamCurrentRole);
  }

  handleChangeRole (teamId, role) {
    const teamCurrentRole = (this.state.visibilityStatus === VISIBILITY.privateTeam)
      ? {}
      : {
        [teamId]: {
          id: teamId,
          type: 'team',
          name: role
        }
      },
      groupCurrentRoles = this.state.visibilityStatus === VISIBILITY.public ? this.state.groupCurrentRoles : {};

    this.setState({
      teamCurrentRole: teamCurrentRole,
      groupCurrentRoles: groupCurrentRoles,
      error: null
    });

    !this.props.showFooterActions && _.isFunction(this.props.onChangeVisibility)
    && this.props.onChangeVisibility(this.state.visibilityStatus, teamCurrentRole);

    typeof this.props.handleChange === 'function' && this.props.handleChange('teamRole', role);
  }

  async fetchRoles () {
    const teamId = getStore('CurrentUserStore').teamId,
      workspaceId = this.props.createMode ? null : getStore('ActiveWorkspaceStore').id,
      {
        rolesList,
        defaultRoles,
        userCurrentRoles,
        groupCurrentRoles
      } = await fetchEntityRoles('workspace', workspaceId),
      teamDefaultRole = {
        [teamId]: {
          id: teamId,
          type: 'team',
          name: _.get(defaultRoles, TEAM_ENTITY_TYPE)
        }
      };

    this.setState({
      rolesList,
      userCurrentRoles,
      groupCurrentRoles,
      teamDefaultRole: teamDefaultRole,
      orderedRoleList: _.orderBy(rolesList, 'isEnabled', 'desc'),
      teamCurrentRole: this.props.createMode
        ? teamDefaultRole
        : this.state.teamCurrentRole
    });
  }

  async fetchPermissions () {
    const teamId = getStore('CurrentUserStore').teamId,
      workspaceId = this.props.createMode ? null : getStore('ActiveWorkspaceStore').id,
      isDefaultWorkspace = _.get(this.props.workspace, 'state.isDefault', false),
      isCommunityManagerEnabled = getStore('FeatureFlagsStore').get('workspace:isCommunityManagerEnabled');

    let permissions = {};

    if (workspaceId) {
      const { updateWorkspaceRoles, updateVisibilityToPublic, updateVisibilityFromPublic } = await fetchPermissions(
        ['updateWorkspaceRoles', 'updateVisibilityToPublic', 'updateVisibilityFromPublic'],
        workspaceId
      );

      permissions = {
        ...permissions,
        updateWorkspaceRoles,
        updateVisibilityToPublic,
        updateVisibilityFromPublic
      };
    }

    if (teamId && isCommunityManagerEnabled) {
      const { updateWorkspaceVisibilityToPublic, updateWorkspaceVisibilityFromPublic, manageWorkspaceVisibilityRequests } =
        await fetchPermissions(['updateWorkspaceVisibilityToPublic', 'updateWorkspaceVisibilityFromPublic', 'manageWorkspaceVisibilityRequests'], teamId);

      permissions = {
        ...permissions,
        updateWorkspaceVisibilityToPublic,
        updateWorkspaceVisibilityFromPublic,
        manageWorkspaceVisibilityRequests
      };
    }

    this.setState({
      permissions,
      isDefaultWorkspace,
      isCommunityManagerEnabled
    });
  }

  async fetchPendingRequests () {
    try {
      const workspaceId = getStore('ActiveWorkspaceStore').id,
        isCommunityManagerEnabled = getStore('FeatureFlagsStore').get('workspace:isCommunityManagerEnabled'),
        isCommunityManager = _.get(this.state.permissions, 'manageWorkspaceVisibilityRequests'),
        searchParams = generateSearchParamsFromObject({
          model: 'workspace',
          modelId: workspaceId,
          state: ACTION_REQUEST_STATES.PENDING_APPROVAL,
          action: ACTION_REQUEST_ACTIONS.MAKE_WORKSPACE_PUBLIC
        });

      if (isCommunityManagerEnabled && !isCommunityManager) {
        let pendingRequests = await RequestToActionService.find(searchParams);

        this.setState({ pendingRequests });
      }
    } catch (error) {
      pm.logger.error(error);
    }
  }

  async makeTeamProfilePublic () {
    return new Promise((resolve, reject) => {
      pm.mediator.trigger('showUpdateTeamProfileModal', {
        description: 'Before your team’s profile can be made public, update your team domain and make sure it\'s eligible for public visibility. Your team domain helps identify your team on Postman.',
        confirmCTAText: 'Continue',
        disablePageRefresh: true,
        onComplete: resolve,
        onCancel: reject
      });
    });
  }

  async makeUserProfilePublic () {
    return new Promise((resolve, reject) => {
      pm.mediator.trigger('showUpdateUserProfileModal', {
        onComplete: resolve,
        onCancel: reject
      });
    });
  }

  updateState (key, value) {
    this.setState({
      [key]: value
    });
  }

  handleCancel () {
    this.setState({
      visibilityStatus: getStore('ActiveWorkspaceStore').visibilityStatus || VISIBILITY.onlyMe,
      teamCurrentRole: this.props.teamCurrentRole || {},
      loading: false,
      error: null
    });
  }

  async handleSave () {
    const currentUser = getStore('CurrentUserStore'),
      workspace = getStore('ActiveWorkspaceStore'),
      teamStore = getStore('TeamStore'),
      teamId = currentUser.teamId,
      teamCurrentRole = {
        id: teamId,
        type: 'team',
        ..._.get(this.state.teamCurrentRole, teamId)
      },
      { roles } = await getRolesData(
        this.state.userCurrentRoles,
        this.state.visibilityStatus === VISIBILITY.privateTeam ? {} : teamCurrentRole,
        'workspace',
        workspace.id,
        this.state.groupCurrentRoles
      );

    this.setState({
      loading: true,
      error: null
    });

    // Make user or team profile public, if not already public
    try {
      if (this.state.visibilityStatus === VISIBILITY.public) {
        if (teamId && !teamStore.hasPublicProfile) {
          await this.makeTeamProfilePublic();
        } else if (!teamId && !currentUser.hasPublicProfile) {
          await this.makeUserProfilePublic();
        }
      }
    } catch (error) {
      this.setState({ loading: false });

      return;
    }

    try {
      if (this.state.visibilityStatus === VISIBILITY.public) {
        const response = await WorkspaceService.updateVisibility({
          id: workspace.id,
          visibilityStatus: this.state.visibilityStatus,
          roles: roles
        });

        if (_.get(response, 'body.data.visibilityStatus') === VISIBILITY.public) {
          pm.toasts.success('Anyone on Postman can now access it.', {
            noIcon: true,
            timeout: 5000,
            title: 'This workspace is public'
          });

          return this.props.handleClose();
        }
      }
      else {
        let workspaceUpdateEvent = {
          name: 'update',
          namespace: 'workspace',
          data: collabUtils.generatePayloadForVisibilityUpdate(workspace, roles, teamId, this.state.visibilityStatus)
        };

        await dispatchUserAction(workspaceUpdateEvent);

        if (this.state.visibilityStatus !== VISIBILITY.public) {
          return WorkspaceSwitchService.switchWorkspace(workspace.id, true);
        }
      }

      this.props.showFooterActions && _.isFunction(this.props.onChangeVisibility)
      && this.props.onChangeVisibility(this.state.visibilityStatus, this.state.teamCurrentRole);
    } catch ({ error }) {
      const errorName = _.get(error, 'name');

      pm.logger.error(error);

      if (errorName === 'publicProfileDisabled') {
        try {
          if (teamId) {
            await this.makeTeamProfilePublic();
          } else {
            await this.makeUserProfilePublic();
          }

          return this.handleSave();
        } catch (e) {
          const error = _.isFunction(ERROR_STATES[errorName]) &&
            ERROR_STATES[errorName](teamId);

          return this.setState({ error: error });
        }
      }

      this.setState({
        error: _.get(ERROR_STATES, errorName, {
          message: 'Unable to change workspace\'s visibility. Try again in some time.'
        })
      });
    } finally {
      this.setState({ loading: false });
    }
  }

  handleRequest () {
    this.setState({
      loading: true,
      error: null
    });

    const workspace = getStore('ActiveWorkspaceStore'),
      options = {
        title: 'Send a request to change the visibility to public',
        message: `Once a Community Manager approves your request, the visibility of ${workspace.name} workspace will be changed to public.`,
        placeholder: 'A short note on why you\'d like to change the workspace\'s visibility to public',

        onSubmit: async (notes) => {
          const data = {
            model: 'workspace',
            modelId: workspace.id,
            context: { action: 'make_workspace_public' },
            notes
          };

          try {
            const response = await RequestToActionService.create(data);

            this.setState({
              pendingRequests: [
                ...this.state.pendingRequests,
                response
              ]
            });

            pm.toasts.success('You’ll be notified of the Community Manager’s response. 30 days left until your request expires.', {
              noIcon: true,
              timeout: 5000,
              title: 'Request sent'
            });

            this.handleCancel();
          } catch ({ error }) {
            pm.logger.error(error);

            pm.toasts.error(_.get(ACTION_REQUEST_ERROR_STATES, _.get(error, 'name'), 'Error occurred while creating action request'));
          } finally {
            this.setState({ loading: false });
          }
        },
        onCancel: () => {
          this.setState({ loading: false });
        }
      };

    pm.mediator.trigger('openRequestToActionModal', options);
  }

  /**
   * Determine whether primary button should be disabled because of loading or error states
   */
  isPrimaryButtonDisabled () {
    const visibilityStatus = VISIBILITY_STATES[this.state.visibilityStatus],
      teamId = getStore('CurrentUserStore').teamId;

    return ((visibilityStatus === VISIBILITY.team || (teamId && visibilityStatus === VISIBILITY.public)) && _.isEmpty(this.state.teamCurrentRole))
      || this.state.loading
      || this.state.error;
  }

  renderPendingRequestBanner () {
    if (
      _.isEmpty(this.state.pendingRequests) ||
      getStore('ActiveWorkspaceStore').visibilityStatus !== VISIBILITY.team ||
      _.get(this.state.permissions, 'manageWorkspaceVisibilityRequests', false)
    ) {
      return (null);
    }

    const currentUser = getStore('CurrentUserStore'),
      createdBy = this.state.pendingRequests[0].createdBy,
      userName = utils.getUserNameForId(createdBy, currentUser, 'an ex-team member');

    return (
      <div className='workspace-visibility-v2--pending-request'>
        <p className='workspace-visibility-v2--pending-request-heading'>Pending approval for public visibility</p>
        {
          createdBy === currentUser.id
            ? <p>A Community Manager is yet to approve your request to change workspace visibility to public.</p>
            : _.isEmpty(userName)
            ? <p>
              A Community Manager is yet to approve
              <a href={`${pm.dashboardUrl}/users/${createdBy}`}> {userName}'s </a>
              request to change workspace visibility to public.
            </p>
            : <p>A Community Manager is yet to approve request to change workspace visibility to public.</p>
        }
      </div>
    );
  }

  createTeam () {
    NavigationService.transitionTo(TEAM_ONBOARDING_IDENTIFIER, null, {
      continueUrl: CREATE_WORKSPACE_URL
    });
  }

  handleCancelCreateTeam () {
    if (this.props.onCancel) {
      this.props.onCancel();

      return;
    }

    // Switch user back to home
    NavigationService.transitionTo(HOME_IDENTIFIER);
  }

  render () {
    const currentUser = getStore('CurrentUserStore'),
      teamStore = getStore('TeamStore'),
      teamId = currentUser.teamId,
      canUpdateRoles = _.get(this.state.permissions, 'updateWorkspaceRoles', true),
      syncVisibilityStatus = getStore('ActiveWorkspaceStore').visibilityStatus,
      visibilityStatus = VISIBILITY_STATES[this.state.visibilityStatus],
      teamCurrentRole = _.get(this.state.teamCurrentRole, `${teamId}.name`),
      teamCurrentRoleName = _.get(_.find(this.state.rolesList, ['name', teamCurrentRole]), 'displayName', 'Select Role'),
      valueChanged = (syncVisibilityStatus !== this.state.visibilityStatus) || (_.get(this.props.teamCurrentRole, `${teamId}.name`) !== teamCurrentRole),
      enabledRolesString = _.reduce(this.state.rolesList, (result, roleObj) => {
        if (roleObj.isEnabled) {
          result.push(roleObj.displayName);
        }

        return result;
      }, []).join(' ,'),
      noTeamVisibilityWhitelist = [VISIBILITY.onlyMe, VISIBILITY.public],
      disabledRoleTooltipText = `You can only assign users an ${enabledRolesString} role on this workspace. `
        + 'Your plan doesn\'t include access management.',
      isPrivateWorkspaceEnabled = getStore('FeatureFlagsStore').get('workspace:isPrivateTeamWorkspaceEnabled'),
      isPublicWorkspaceEnabled = getStore('FeatureFlagsStore').get('workspace:publicWorkspaceCreationEnabled'),
      isCommunityManagerEnabled = getStore('FeatureFlagsStore').get('workspace:isCommunityManagerEnabled'),
      isCommunityManager = _.get(this.state.permissions, 'manageWorkspaceVisibilityRequests', false),
      canUpdatePublicVisibility = isCommunityManagerEnabled
        ? _.get(this.state.permissions, 'updateWorkspaceVisibilityToPublic') || _.get(this.state.permissions, 'updateWorkspaceVisibilityFromPublic')
        : _.get(this.state.permissions, 'updateVisibilityToPublic') || _.get(this.state.permissions, 'updateVisibilityFromPublic'),
      isCreateTeamVisible = this.props.createMode && !teamId && !noTeamVisibilityWhitelist.includes(this.state.visibilityStatus);

    return (
      <div className='workspace-visibility-v2'>
        {this.renderPendingRequestBanner()}

        <h2 className='workspace-visibility-v2--title'>Visibility</h2>

        <div className='workspace-visibility-v2--container'>
          <div>
            {
              !this.props.createMode && (this.state.isDefaultWorkspace ||
                (teamId
                  ? (isCommunityManagerEnabled ? false : !canUpdateRoles)
                  || (syncVisibilityStatus === VISIBILITY.public && !(canUpdatePublicVisibility || _.get(this.state.permissions, 'updateVisibilityFromPublic')))
                  : false)
              ) ? (
                <div className='workspace-visibility-v2--dropdown-button'>
                  <Icon name={visibilityStatus.icon} className='pm-icon' />
                  <span>{visibilityStatus.displayName}</span>
                  {
                    visibilityStatus.name === VISIBILITY.public && (
                      <span className='workspace-visibility-v2--beta-label'>Beta</span>
                    )
                  }
                </div>
              ) : (
                <div className='workspace-visibility-v2--dropdown-button'>
                  <Icon name={visibilityStatus.icon} className='pm-icon' />
                  <span>{visibilityStatus.displayName}</span>
                  {
                    visibilityStatus.name === VISIBILITY.public && (
                      <span className='workspace-visibility-v2--beta-label'>Beta</span>
                    )
                  }
                </div>
              )
            }
          </div>

          {
            visibilityStatus.subtitleText && (
              <div className='workspace-visibility-v2--subtitle'>
                <Text
                  type='body-medium'
                  value={visibilityStatus.subtitleText}
                />
              </div>
            )
          }

          {
            !teamId && !(this.state.visibilityStatus === VISIBILITY.onlyMe || this.state.visibilityStatus === VISIBILITY.public) && (
              <div className='workspace-visibility-v2--subtitle'>
                <Text type='body-medium' value='All teammates can view and join' />
              </div>
            )
          }

          {
            this.state.visibilityStatus === VISIBILITY.public && (
              <div className='workspace-visibility-v2--subtitle'>
                <Text type='body-medium' value='Anyone can view' />
              </div>
            )
          }

          {
            teamId && visibilityStatus.roleText && (
              <div className='workspace-visibility-v2--roles'>
                <Text
                  type='body-medium'
                  value={visibilityStatus.roleText}
                />
                {
                  !this.props.createMode && (this.state.isDefaultWorkspace || !canUpdateRoles) ? (
                    <span className='workspace-visibility-v2--roles--dropdown-button'>
                      <span>{teamCurrentRoleName}</span>
                    </span>
                  ) : (
                    <Dropdown onSelect={(role) => this.handleChangeRole(teamId, role)}>
                      <DropdownButton size='small'>
                        <Button className='workspace-visibility-v2--roles--dropdown-button'>
                          <span>{teamCurrentRoleName}</span>
                        </Button>
                      </DropdownButton>
                      <DropdownMenu
                        fluid
                        className='role-dropdown'
                      >
                        {
                          _.map(this.state.orderedRoleList, (role) => {
                            return (
                              <MenuItem
                                key={role.name}
                                refKey={role.name}
                                disabled={!role.isEnabled}
                                disabledText={disabledRoleTooltipText}
                              >
                                <span>{role.displayName}</span>
                              </MenuItem>
                            );
                          })
                        }
                      </DropdownMenu>
                    </Dropdown>
                  )
                }
              </div>
            )
          }
        </div>

        {
          (this.state.error && this.state.error.message) && (
            <div className='workspace-visibility-v2--error'>
              <Icon name='icon-state-warning-stroke' className='pm-icon' />
              <span>{this.state.error.message}</span>
              {
                this.state.error.action && (
                  <a onClick={this.state.error.action.onClick}>
                    {this.state.error.action.title}
                  </a>
                )
              }
            </div>
          )
        }

        {
          isCreateTeamVisible && (
            <div className='workspace-visibility-v2--actions'>
              <Button
                className='workspace-visibility-v2--actions-create-team-btn'
                type='primary'
                size='small'
                onClick={this.createTeam}
              >
                Create Team
              </Button>
              <Button
                className='workspace-visibility-v2--actions-cancel-btn'
                type='secondary'
                size='small'
                onClick={this.handleCancelCreateTeam}
              >
                Cancel
              </Button>
            </div>
          )
        }

        {
          !this.props.createMode && valueChanged && canUpdatePublicVisibility && !this.state.error &&
          this.state.visibilityStatus === VISIBILITY.public && (teamId ? teamStore.hasPublicProfile : currentUser.hasPublicProfile) && (
            <div className='workspace-visibility-v2--info'>
              <Icon name='icon-state-info-stroke' className='pm-icon' />
              <span>
                All data in this workspace will be made public.
              </span>
            </div>
          )
        }

        {
          valueChanged && (this.props.createMode ? true : canUpdatePublicVisibility) && !this.state.error &&
          this.state.visibilityStatus === VISIBILITY.public && teamId && !teamStore.hasPublicProfile
          && (async () => { await this.makeTeamProfilePublic(); })() && (
            <div className='workspace-visibility-v2--info'>
              <Icon name='icon-state-info-stroke' className='pm-icon' />
              <span>Your <a href={`${pm.dashboardUrl}/settings/team`}>team's profile</a> and all data in this workspace will be made public.</span>
            </div>
          )
        }

        {
          valueChanged && (this.props.createMode ? true : canUpdatePublicVisibility) && !this.state.error &&
          this.state.visibilityStatus === VISIBILITY.public && !teamId && !currentUser.hasPublicProfile &&
          this.makeUserProfilePublic() && (
            <div className='workspace-visibility-v2--info'>
              <Icon name='icon-state-info-stroke' className='pm-icon' />
              <span>Your user profile <a href={`${pm.dashboardUrl}/settings`}>user profile</a> and all data in this workspace will be made public.</span>
            </div>
          )
        }
      </div>
    );
  }
}

WorkspaceVisibilitySelector.propTypes = {
  disabled: PropTypes.array,
  createMode: PropTypes.bool,
  disabledText: PropTypes.string,
  teamCurrentRole: PropTypes.object,
  showFooterActions: PropTypes.bool,
  onChangeVisibility: PropTypes.func
};

export default WorkspaceVisibilitySelector;

