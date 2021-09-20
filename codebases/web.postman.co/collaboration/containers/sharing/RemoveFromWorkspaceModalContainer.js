import React, { Component } from 'react';
import { observer } from 'mobx-react';
import DeleteConfirmationModal from '../../../js/components/collections/DeleteConfirmationModal';
import dispatchUserAction from '../../../js/modules/pipelines/user-action';
import AnalyticsService from '../../../js/modules/services/AnalyticsService';
import { getStore } from '../../../js/stores/get-store';
import LoadingIndicator from '../../../js/components/base/LoadingIndicator';
import WarningIcon from '../../../js/components/base/Icons/WarningIcon';
import WorkspaceDependencyService from '../../../js/services/WorkspaceDependencyService';
import { Button } from '../../../js/components/base/Buttons';
import { ENTITY_CONFIG } from './config/RemoveFromWorkspaceModalConfig';
import { decomposeUID } from '../../../js/utils/uid-helper';
import { deleteEnvironment } from '@@runtime-repl/environment/_api/EnvironmentInterface';
import { COLLECTION, ENVIRONMENT, MOCK, MONITOR, dependencyPermissionMap } from './config/DependencyPermissionConfig';
import { shareCollection, shareEnvironment, shareAPI } from '../../../js/modules/services/ShareModalService';
import { deleteCollection } from '@@runtime-repl/collection/_api/CollectionInterface';
import { fetchPermissions } from '../../services/PermissionService';

const initialState = {
    id: null,
    type: null,
    origin: null,
    isOpen: false,
    modelId: null,
    isLoading: false,
    isDisabled: true,
    isRemoving: false,
    workspaces: []
  };

@observer
export default class RemoveFromWorkspaceModalContainer extends Component {
  constructor (props) {
    super(props);

    this.state = initialState;

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleAction = this.handleAction.bind(this);
  }

  UNSAFE_componentWillMount () {
    pm.mediator.on('showRemoveFromWorkspaceModal', this.handleOpen);
  }

  componentWillUnmount () {
    pm.mediator.off('showRemoveFromWorkspaceModal', this.handleOpen);
  }

  handleAction (action) {
    if (this.state.type === ENVIRONMENT) {
      if (action === 'delete') {
        deleteEnvironment(this.state.id, { origin: 'remove_from_workspace' });
      } else if (action === 'share') {
        shareEnvironment(this.state.id, { origin: 'remove_from_workspace' });
      }
    } else if (this.state.type === COLLECTION) {
      if (action === 'delete') {
        deleteCollection(this.state.id, { origin: 'remove_from_workspace' });
      } else if (action === 'share') {
        shareCollection(this.state.id, { origin: 'remove_from_workspace' });
      }
    } else if (this.state.type === 'api') {
      if (action === 'delete') {
        pm.mediator.trigger('showAPIDeleteModal', this.state.id, { origin: 'remove_from_workspace' });
      } else if (action === 'share') {
        shareAPI(this.state.id, { origin: 'remove_from_workspace' });
      }
    }

    this.handleClose();
  }

  async handleOpen (id, { type, origin, disableDelete = false, disableShare = false }, callback) {
    if (_.isEmpty(id) || _.isEmpty(type)) {
      return;
    }

    if (!id) {
      return;
    }

    let modelId = id;

    // For collection and environment the ids are UID's hence decomposing them
    if (type === COLLECTION || type === ENVIRONMENT) {
      modelId = decomposeUID(modelId).modelId;
    }

    this.setState({
      type,
      origin,
      id,
      modelId,
      disableDelete,
      disableShare,
      isOpen: true,
      isLoading: true,
      isDisabled: true
    });

    this.callback = _.isFunction(callback) && callback;

    const dependencyPermission = dependencyPermissionMap[type],
      activeWorkspaceId = getStore('ActiveWorkspaceStore').id;

    try {
      let removeFromWorkspacePermissionResponse = await fetchPermissions([dependencyPermission.removeFromWorkspace], activeWorkspaceId),
        workspacesInWhichThisExistsResponse = await WorkspaceDependencyService.getWorkspaces({ id, type }),

        canRemoveWorkspacePermissions = _.get(removeFromWorkspacePermissionResponse, dependencyPermission.removeFromWorkspace, false),
        workspaces = workspacesInWhichThisExistsResponse && workspacesInWhichThisExistsResponse.body;

      if (!canRemoveWorkspacePermissions) {
        this.setState({ isDisabled: true, isLoading: false });
        return;
      }

      AnalyticsService.addEvent(type, 'initiate_remove_from_ws', origin);

      let numberOfTeamWorkspaces = _.filter(workspaces || [], ['type', 'team']).length,
        numberOfPersonalWorkspaces = _.filter(workspaces || [], ['type', 'team']).length;

      // Remove from workspace not allowed for mock/monitor
      if (type === MOCK || type === MONITOR) {
        this.setState({ isDisabled: true, isLoading: false });
        return;
      }

      // if just present in one workspace. not allowed.
      if (workspaces.length === 1) {
        this.setState({ isLoading: false, isDisabled: true });
        return;
      }

      // if more than one team workspace. Allow.
      if (numberOfTeamWorkspaces > 1) {
        this.setState({ isLoading: false, isDisabled: false });
        return;
      }

      // if existing in team workspace, and getting removed from personal allow it.
      if (numberOfTeamWorkspaces >= 1 && (getStore('ActiveWorkspaceStore').visibilityStatus === 'only-me') || getStore('ActiveWorkspaceStore').type === 'personal') {
        this.setState({ isLoading: false, isDisabled: false });
        return;
      }

      // Do not allow, if this exists in only one team workspace. And removal is also happening from a team workspace.
      if (numberOfTeamWorkspaces === 1 && (getStore('ActiveWorkspaceStore').type === 'team' || getStore('ActiveWorkspaceStore').visibilityStatus === 'team')) {
        this.setState({ isDisabled: true, isLoading: false });
        return;
      }

      // if no team workspaces, then we should also not allow getting removed from last personal workspace
      if (numberOfTeamWorkspaces === 0) {
        if (numberOfPersonalWorkspaces > 1) {
          this.setState({ isDisabled: false, isLoading: false });
        } else {
          this.setState({ isDisabled: true, isLoading: false });
        }
      }
    }

    catch (e) {
      this.handleClose();

      pm.toasts.error(`Unable to remove ${_.get(ENTITY_CONFIG[this.state.type], 'userFriendlyEntityName', this.state.type)} from workspace`);
      pm.logger.error(`Error in pipeline for remove ${this.state.type} from workspace`, e);
    }

    finally {
      _.invoke(this, 'keymapRef.focus');
    }
  }

  handleClose () {
    this.callback = null;

    this.setState(initialState, () => {
      pm.mediator.trigger('focusSidebar');
    });
  }

  handleConfirm () {
    if (this.state.isDisabled) {
      return;
    }

    this.setState({ isRemoving: true });

    let removeEntityEvent = {
      name: 'removeDependenciesOnline',
      namespace: 'workspace',
      data: {
        dependencies: [{
          model: this.state.type,
          modelId: this.state.id
        }],
        model: 'workspace',
        workspace: { id: getStore('ActiveWorkspaceStore').id }
      }
    },
    entityName = _.get(ENTITY_CONFIG[this.state.type], 'userFriendlyEntityName', this.state.type);

    dispatchUserAction(removeEntityEvent)
      .then((response) => {
        if (!_.isEmpty(_.get(response, 'error'))) {
          pm.logger.error(`Error in removing ${this.state.type} from workspace`, response.error);
          return;
        }

        AnalyticsService.addEvent(this.state.type, 'remove_from_ws', this.state.origin);

        pm.toasts.success(`Successfully removed ${entityName} from workspace`);
        this.callback && this.callback();
        this.handleClose();
      })
      .catch((err) => {
        this.setState({ isRemoving: false });

        pm.toasts.error(`Unable to remove ${entityName} from workspace`);
        pm.logger.error(`Error in pipeline for remove ${this.state.type} from workspace`, err);
      });
  }

  getMessage () {
    if (this.state.isLoading) {
      return (
        <LoadingIndicator />
      );
    }

    let entityName = _.get(ENTITY_CONFIG[this.state.type], 'userFriendlyEntityName', this.state.type);

    if (this.state.isDisabled) {
      return (
        <div className='cannot-remove-from-workspace-modal-message'>
          <WarningIcon size='sm' />
          <div className='help-text'>
            This {entityName} is only present in this workspace and can’t be removed. You can either&nbsp;
            <Button
              type='text'
              className='delete-link'
              disabled={this.state.disableDelete}
              tooltip={this.state.disableDelete && `You do not have permissions to delete this ${entityName}`}
              onClick={() => this.handleAction('delete')}
            >
              delete
            </Button>
            &nbsp;it permanently or&nbsp;
            <Button
              type='text'
              className='share-link'
              disabled={this.state.disableShare}
              tooltip={this.state.disableShare && `You do not have permissions to share this ${entityName}`}
              onClick={() => this.handleAction('share')}
            >
              share
            </Button>
            &nbsp;it to another workspace before removing it.
          </div>
        </div>
      );
    }
    else {
      return (
        <div className='remove-from-workspace-modal-message'>
          <div>Are you sure you want to remove this {entityName} from this workspace?</div>
          <div className='helptext'>{_.get(ENTITY_CONFIG[this.state.type], 'helpText')}</div>
        </div>
      );
    }
  }

  render () {
    const isOffline = !getStore('SyncStatusStore').isSocketConnected;

    return (
      <DeleteConfirmationModal
        preventFocusReset
        isDisabled={isOffline || this.state.isDisabled}
        title={`Remove ${this.state.type}`.toUpperCase()}
        primaryAction={this.state.isRemoving ? <LoadingIndicator /> : 'Remove'}
        message={this.getMessage()}
        isOpen={this.state.isOpen}
        keymapRef={(ref) => { this.keymapRef = ref; }}
        onConfirm={this.handleConfirm}
        onRequestClose={this.handleClose}
        tooltip={isOffline && 'Get online to perform this action'}
      />
    );
  }
}
