import React, { Component } from 'react';
import { Modal, ModalHeader, ModalContent, ModalFooter } from '../base/Modals';
import ProgressBar from '../base/ProgressBar';
import { Button } from '../base/Buttons';

export default class UpdateCheckingModal extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <Modal
        isOpen={this.props.isOpen}
        onRequestClose={this.props.onRequestClose}
        className='update-checking'
      >
        <ModalHeader>CHECKING FOR UPDATES...</ModalHeader>
        <ModalContent>
          <div className='update-checking__progress'>
            <ProgressBar />
          </div>
        </ModalContent>
        <ModalFooter>
          <Button
            type='secondary'
            onClick={this.props.onRequestClose}
          >Cancel</Button>
        </ModalFooter>
      </Modal>
    );
  }
}
