import React, { Component } from 'react';
import { Modal, ModalContent } from '../base/Modals';
import { Button } from '../base/Buttons';
import { observer } from 'mobx-react';
import { getStore } from '../../stores/get-store';
import CloseIcon from '../base/Icons/CloseIcon';

@observer
class WorkspaceJoinModal extends Component {
  render () {
    return (
      <Modal
        className='workspace-join-modal'
        isOpen={this.props.isOpen}
        onRequestClose={this.props.onRequestClose}
      >
        <CloseIcon onClick={this.props.onRequestClose} className='workspace-join-modal--dismiss-icon' />
        <ModalContent>
          <div className='workspace-join-modal__wrapper'>
            <div className='modal-header-close-button' onClick={this.props.onRequestClose} />
            <div className='workspace-join-thumbnail__container'>
              <div className='workspace-join-thumbnail' />
            </div>
            <div className='workspace-join-modal__content'>
              <div className='workspace-join-modal__header'>
                Only members of a workspace can perform this action
              </div>
              <div className='workspace-join-modal__subtext'>
                You need to be a member of this workspace to perfom this action. Joining a workspace allows you to view and collaboratively work on everything inside it.
              </div>
              <div className='workspace-join-modal__action'>
                <Button
                  type='primary'
                  onClick={this.props.onJoinWorkSpace}
                  disabled={this.props.isJoining}
                >
                {
                  this.props.isJoining ?
                  'Joining this workspace' :
                  'Join this workspace'
                }
                </Button>
              </div>
            </div>
          </div>
        </ModalContent>
      </Modal>
    );
  }
}

export default WorkspaceJoinModal;
