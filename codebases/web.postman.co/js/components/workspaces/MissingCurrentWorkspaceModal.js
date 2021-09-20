import React, { Component } from 'react';
import { Modal, ModalContent } from '../base/Modals';
import { Button } from '../base/Buttons';

class MissingCurrentWorkspaceModal extends Component {
  render () {
    return (
      <Modal
        className='missing-current-workspace-modal'
        isOpen={this.props.isOpen}
        onRequestClose={this.props.onRequestClose}
      >
        <ModalContent>
          <div className='missing-current-workspace-modal__wrapper'>
            <div className='modal-header-close-button' onClick={this.props.onRequestClose} />
            <div className='missing-current-workspace-thumbnail__container'>
              <div className='missing-current-workspace-thumbnail' />
            </div>
            <div className='missing-current-workspace-modal__content'>
              <div className='missing-current-workspace-modal__header'>
              We can't seem to find the {this.props.workspaceName} workspace
              </div>
              <div className='missing-current-workspace-modal__subtext'>
              The workspace might have been deleted by another user in your team. You have been switched to one of your personal workspaces.
              </div>
              <div className='missing-current-workspace-modal__action'>
                <Button
                  type='primary'
                  onClick={this.props.onRequestClose}
                >
                  Okay
                </Button>
              </div>
            </div>
          </div>
        </ModalContent>
      </Modal>
    );
  }
}

export default MissingCurrentWorkspaceModal;
