import React, { Component } from 'react';
import { reaction } from 'mobx';
import { observer } from 'mobx-react';
import DeleteConfirmationModal from '../../components/collections/DeleteConfirmationModal';
import dispatchUserAction from '../../modules/pipelines/user-action';
import { getStore } from '../../stores/get-store';
import { createEvent } from '../../modules/model-event';
import SyncWorkspaceController from '../../modules/controllers/SyncWorkspaceController';
import NavigationService from '../../services/NavigationService';
import { OPEN_WORKSPACE_IDENTIFIER } from '../../../collaboration/navigation/constants';
import { PageService } from '../../../appsdk/services/PageService';
import { HOME } from '../../navigation/active-mode/constants';

@observer
export default class DeleteWorkspaceContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isOpen: false,
      id: null,
      meta: null,
      isDeleting: false
    };

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
  }

  UNSAFE_componentWillMount () {
    pm.mediator.on('showWorkspaceDeleteModal', this.handleOpen);
  }

  componentWillUnmount () {
    pm.mediator.off('showWorkspaceDeleteModal', this.handleOpen);
  }

  handleOpen (workspaceId, options = {}, callback) {
    this.callback = _.isFunction(callback) && callback;

    return Promise.resolve()
      .then(() => {
        let workspace = getStore('WorkspaceStore').find(workspaceId);

        if (!_.isEmpty(workspace)) {
          return workspace;
        }

        return SyncWorkspaceController.get({ id: workspaceId }, { populate: [] });
      })
      .then((workspace) => {
        this.setState({
          isOpen: true,
          id: workspace.id,
          meta: { name: workspace.name },
          text: options.text || null
        }, () => {
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
    let deleteWorkspaceEvent = createEvent(
      'delete',
      'workspace',
      { id: this.state.id }
    ),
    activeWorkspaceId = getStore('ActiveWorkspaceStore').id;

    this.setState({ isDeleting: true });

    dispatchUserAction(deleteWorkspaceEvent).then((response) => {
      this.setState({ isDeleting: false });

      if (!_.isEmpty(_.get(response, 'error'))) {
        pm.logger.error('Error in deleting workspace', response.error);
        pm.toasts.error(response.message || '', {
          noIcon: true,
          title: 'Can\'t delete workspace'
        });
      }

      if (PageService.activePage === OPEN_WORKSPACE_IDENTIFIER && activeWorkspaceId === this.state.id) {
        NavigationService.transitionTo(HOME);
      }

      return this.handleClose();
    })
    .catch((err) => {
      this.setState({ isDeleting: false });

      pm.toasts.error(err.message || '', {
        noIcon: true,
        title: 'Can\'t delete workspace'
      });
    });
  }

  getMessage () {
    return (
      <div className='delete-confirmation-modal-message'>
        <div className='helptext'>{this.state.text || 'Members of this workspace might lose access to the collections and environments in this workspace.'}</div>
      </div>
    );
  }

  render () {
    return (
      <DeleteConfirmationModal
        preventFocusReset
        className='delete-collection-confirmation-modal'
        title={`DELETE ${this.state.meta ? this.state.meta.name : ''}?`.toUpperCase()}
        primaryAction={this.state.isDeleting && 'Deleting' || 'Delete'}
        isDisabled={this.state.isDeleting}
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
