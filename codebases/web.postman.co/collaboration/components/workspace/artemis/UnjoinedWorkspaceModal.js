import React, { Component } from 'react';
import { IllustrationNoActivity } from '@postman/aether';
import { Button } from '../../../../js/components/base/Buttons';
import { observer } from 'mobx-react';
import { getStore } from '../../../../js/stores/get-store';
import { Modal, ModalContent } from '../../../../js/components/base/Modals';
import CloseIcon from '../../../../js/components/base/Icons/CloseIcon';
import dispatchUserAction from '../../../../js/modules/pipelines/user-action';
import { createEvent } from '../../../../js/common/model-event';
import WorkspaceJoinButton from '../WorkspaceJoinButton';
import { fetchPermissions } from '../../../../js/modules/services/PermissionsService';
import LoadingIndicator from '../../../../js/components/base/LoadingIndicator';

@observer
export default class UnjoinedWorkspaceModal extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isOpen: false,
      loading: true
    };

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount () {
    pm.mediator.on('openUnjoinedWorkspaceModal', this.handleOpen);
  }

  componentWillUnmount () {
    pm.mediator.off('openUnjoinedWorkspaceModal', this.handleOpen);
  }

  async handleOpen () {
    let activeWorkspaceStore = getStore('ActiveWorkspaceStore');

    // bailout if active workspace is not present of user is member of the workspace
    if (!activeWorkspaceStore.id || activeWorkspaceStore.isMember) {
      return;
    }

    this.setState({
      isOpen: true
    });

    await getStore('SyncStatusStore').onSyncAvailable();

    const { joinWorkspace: canJoinWorkspace } = await fetchPermissions(['joinWorkspace'], activeWorkspaceStore.id);

    if (!canJoinWorkspace) {
      this.setState({
        isOpen: false
      });

      return pm.mediator.trigger('openNotEnoughPermissionsModal');
    }

    this.setState({
      loading: false
    });
  }

  handleClose () {
    this.setState({
      isOpen: false
    });
  }

  getStyles () {
    return {
      width: '35vw',
      minWidth: '600px',
      overflow: 'hidden'
    };
  }

  render () {
    return (
      <Modal
        className='unjoined-workspace-modal-container'
        isOpen={this.state.isOpen}
        customStyles={this.getStyles()}
      >
        <ModalContent className='unjoined-workspace-modal'>
          {
            this.state.loading &&
              <div className='unjoined-workspace-modal__loading'>
                <LoadingIndicator />
              </div>
          }

          {
            !this.state.loading && (
              <div>
                <div className='unjoined-workspace-modal__header'>
                  <div
                    className='unjoined-workspace-modal__header-close-btn-wrapper'
                    onClick={this.handleClose}
                  >
                    <CloseIcon />
                  </div>
                </div>
                <div className='unjoined-workspace-modal__content'>
                  <IllustrationNoActivity />
                  <div className='unjoined-workspace-modal__title'>Join this workspace first</div>
                  <div className='unjoined-workspace-modal__description'>
                    Only workspace members can perform this action. Joining the workspace will allow you to view and collaborate on all workspace contents.
                  </div>
                  <WorkspaceJoinButton
                    className='unjoined-workspace-modal__join-btn'
                    workspaceId={getStore('ActiveWorkspaceStore').id}
                    label='Join Workspace'
                    postJoinHandler={this.handleClose}
                  />
                </div>
              </div>
            )
          }
        </ModalContent>
      </Modal>
    );
  }
}
