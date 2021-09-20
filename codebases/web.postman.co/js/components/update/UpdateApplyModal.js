import React, { Component } from 'react';
import { Modal, ModalHeader, ModalContent, ModalFooter } from '../base/Modals';
import { Button } from '../base/Buttons';

export default class UpdateApplyModal extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <Modal
        isOpen={this.props.isOpen}
        onRequestClose={this.props.onRequestClose}
        className='update-apply'
      >
        <ModalHeader>RESTART AND INSTALL UPDATE</ModalHeader>
        <ModalContent>
          <div className='update-apply__message'>
            Update downloaded. You need to restart Postman to install the update.
          </div>
        </ModalContent>
        <ModalFooter>
          <Button
            type='primary'
            onClick={this.props.onApplyUpdate}
          >Restart and Install Update</Button>
          <Button
            type='secondary'
            onClick={this.props.onRequestClose}
          >Later</Button>
        </ModalFooter>
      </Modal>
    );
  }
}
