import React, { Component } from 'react';
import { Modal, ModalHeader, ModalContent, ModalFooter } from '../base/Modals';
import ProgressBar from '../base/ProgressBar';
import { Button } from '../base/Buttons';

export default class UpdateDownloadingModal extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <Modal
        isOpen={this.props.isOpen}
        onRequestClose={this.props.onRequestClose}
        className='update-downloading'
      >
        <ModalHeader>DOWNLOADING UPDATE</ModalHeader>
        <ModalContent>
          <div className='update-downloading__progress'>
            <ProgressBar />
          </div>
        </ModalContent>
        <ModalFooter>
          <Button
            type='primary'
            onClick={this.props.onRequestClose}
          >Download in background</Button>
          <Button
            type='secondary'
            onClick={this.props.onCancel}
          >Cancel</Button>
        </ModalFooter>
      </Modal>
    );
  }
}
