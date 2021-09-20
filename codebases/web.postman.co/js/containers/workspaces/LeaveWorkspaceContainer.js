import React, { Component } from 'react';
import { Icon } from '@postman/aether';
import { observer } from 'mobx-react';
import DeleteConfirmationModal from '../../components/collections/DeleteConfirmationModal';
import dispatchUserAction from '../../modules/pipelines/user-action';
import { getStore } from '../../stores/get-store';
import { createEvent } from '../../modules/model-event';
import SyncWorkspaceController from '../../modules/controllers/SyncWorkspaceController';
import { VISIBILITY } from '../../constants/WorkspaceVisibilityConstants';

@observer
export default class LeaveWorkspaceContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isOpen: false,
      id: null,
      meta: null,
      isLeaving: false
    };

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
  }

  UNSAFE_componentWillMount () {
    pm.mediator.on('showWorkspaceLeaveModal', this.handleOpen);
  }

  componentWillUnmount () {
    pm.mediator.off('showWorkspaceLeaveModal', this.handleOpen);
  }

  handleOpen (workspaceId, options = {}, callback) {
    return Promise.resolve()
    .then(() => {
      let workspace = getStore('WorkspaceStore').find(workspaceId);

      if (!_.isEmpty(workspace)) {
        return workspace;
      }

      return SyncWorkspaceController.get({ id: workspaceId }, { populate: [] });
    })

    .then((workspace) => {
      this.callback = _.isFunction(callback) && callback;
      this.setState({
        id: workspace.id,
        meta: {
          name: workspace.name,
          visibilityStatus: workspace.visibilityStatus
        },
        text: options.text || null
      }, () => {
        if (options.leaveImmediately) {
          this.handleConfirm();
        } else {
          this.setState({ isOpen: true });
        }

          _.invoke(this, 'keymapRef.focus');
        });
      });
  }

  handleClose () {
    this.callback = null;
    _.isFunction(this.onLifecycleChange) && this.onLifecycleChange();
    this.setState({
      isOpen: false,
      id: null,
      meta: null
    });
  }

  handleConfirm () {
    let leaveWorkspaceEvent = createEvent(
      'leave',
      'workspace',
      {
        model: 'workspace',
        workspace: { id: this.state.id }
      });

      this.setState({ isLeaving: true });

    dispatchUserAction(leaveWorkspaceEvent).then((response) => {
      this.setState({ isLeaving: false });

      if (!_.isEmpty(_.get(response, 'error'))) {
        pm.toasts.error('Something went wrong while leaving the workspace.');
        return;
      }

      pm.toasts.info('You left the workspace', {
        type: 'info',
        timeout: 5000
      });

      this.handleClose();
    })
    .catch((err) => {
      this.setState({ isLeaving: false });

      pm.toasts.error((err && err.message) || 'Something went wrong while leaving the workspace.');
    });
  }

  getMessage () {
    if (this.state.meta && (this.state.meta.visibilityStatus === VISIBILITY.privateTeam)) {
      return (
        <div className='leave-private-workspace-modal--message'>
          <div className='helptext'>You won’t be able to view or access this private workspace. However, you may still have access to the workspace if your group belongs to it.</div>

          <div className='leave-private-workspace-modal--info'>
            <Icon name='icon-state-info-stroke' className='pm-icon' />
            <span>You will still be able to access the workspace’s elements like APIs, collections, mock servers, etc., to which you have an Editor or a Viewer role.</span>
          </div>
        </div>
      );
    }

    return (
      <div className='delete-confirmation-modal-message'>
        <div className='helptext'>{this.state.text || 'You will no longer be able to collaborate on the collections and environments within this workspace.'}</div>
      </div>
    );
  }

  render () {
    return (
      <DeleteConfirmationModal
        preventFocusReset
        className='delete-collection-confirmation-modal'
        title={`LEAVE ${this.state.meta ? this.state.meta.name : ''}?`.toUpperCase()}
        primaryAction={this.state.isLeaving && 'Leaving' || 'Leave'}
        isDisabled={this.state.isLeaving}
        message={this.getMessage()}
        isOpen={this.state.isOpen}
        keymapRef={(ref) => { this.keymapRef = ref; }}
        meta={this.state.meta}
        onConfirm={this.handleConfirm}
        onRequestClose={this.handleClose}
      />
    );
  }
}
