import React, { Component } from 'react';
import { Button } from '../components/base/Buttons';
import { Modal, ModalHeader, ModalContent, ModalFooter } from '../components/base/Modals';

export default class OpenExternalLinkModal extends Component {
  constructor (props) {
    super(props);

    this.handleClose = this.handleClose.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
  }

  handleClose () {
    this.props.onClose && this.props.onClose();
  }

  handleConfirm () {
    this.props.onConfirm && this.props.onConfirm();
  }

  getCustomStyles () {
    return { marginTop: '35vh' };
  }

  render () {

    return (
      <Modal
        isOpen={this.props.isOpen}
        onRequestClose={this.handleClose}
        className='open-external-link-modal'
        customStyles={this.getCustomStyles()}
      >
        <ModalHeader>Opening external application</ModalHeader>
        <ModalContent>
          <div className='open-external-link-modal-body'>
            You are trying to open a link using a non-standard protocol (HTTP/HTTPS). Are you sure you want to continue?
            <div className='open-external-link-modal-message'>
              Link:
              <span className='open-external-link-modal-message-url'> {this.props.url}</span>
            </div>
          </div>
        </ModalContent>
        <ModalFooter>

        <Button
          type='secondary'
          onClick={this.handleConfirm}
        >Continue</Button>
          <Button
            type='primary'
            onClick={this.handleClose}
          >Cancel</Button>
        </ModalFooter>
      </Modal>
    );
  }
}
