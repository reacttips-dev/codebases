import React, { Component } from 'react';
import { Modal, ModalHeader, ModalContent, ModalFooter } from '../base/Modals';

export default class UpdateNotAvailableModal extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <Modal
        isOpen={this.props.isOpen}
        onRequestClose={this.props.onRequestClose}
        className='update-not-available'
      >
        <ModalHeader>UP TO DATE</ModalHeader>
        <ModalContent>
          <div className='update-not-available__message'>
            <div className='postman-logo' />
            <div>You are up to date! Postman v{this.props.currentVersion} is the latest version.</div>
          </div>
        </ModalContent>
      </Modal>
    );
  }
}
