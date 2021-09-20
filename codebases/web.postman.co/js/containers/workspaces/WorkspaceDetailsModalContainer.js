import React, { Component } from 'react';

import SyncWorkspaceController from '../../modules/controllers/SyncWorkspaceController';
import { Modal, ModalHeader, ModalContent } from '../../components/base/Modals';
import WorkspaceDetailsModal from '../../components/workspaces/WorkspaceDetailsModal';

import {
  DETAILS_WORKSPACE_IDENTIFIER
} from '../../../collaboration/navigation/constants';
import NavigationService from '../../services/NavigationService';

export default class WorkspaceDetailsModalContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isOpen: false,
      workspace: {}
    };

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount () {
    pm.mediator.on('openWorkspaceDetailsModal', this.handleOpen);
  }

  componentWillUnmount () {
    pm.mediator.off('openWorkspaceDetailsModal', this.handleOpen);
  }

  handleOpen (workspaceId) {
    if (this.state.isOpen) {
      return;
    }

    if (!workspaceId) {
      pm.logger.warn('WorkspaceDetailsModalContainer~No workspace id passed');

      return;
    }

    SyncWorkspaceController.get({ id: workspaceId }, { populate: ['createdBy', 'members'] })
      .then((workspace) => {
        !this.state.isOpen && this.setState({
          isOpen: true,
          workspace
        }, function () {
          window.SDK_PLATFORM === 'browser' && NavigationService.setURL(DETAILS_WORKSPACE_IDENTIFIER, {}, {
            wid: workspaceId
          });
        });
    });
  }

  handleClose () {
    this.state.isOpen && this.setState({
      isOpen: false,
      workspace: {}
    });
  }

  getCustomStyles () {
    return {
      height: '80vh',
      marginTop: '10vh',
      width: '640px'
    };
  }

  render () {
    return (
      <Modal
        className='workspace-details-modal'
        isOpen={this.state.isOpen}
        onRequestClose={this.handleClose}
        customStyles={this.getCustomStyles()}
      >
        <ModalHeader />
        <ModalContent>
          <WorkspaceDetailsModal
            workspace={this.state.workspace}
          />
        </ModalContent>
      </Modal>
    );
  }
}
