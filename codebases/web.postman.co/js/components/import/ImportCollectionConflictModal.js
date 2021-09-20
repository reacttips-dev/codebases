import React, { Component } from 'react';
import { Button } from '../base/Buttons';
import { Modal, ModalHeader, ModalContent, ModalFooter } from '../base/Modals';

export default class ImportCollectionConflictModal extends Component {
  constructor (props) {
    super(props);
  }

  getCustomStyles () {
    return { marginTop: '35vh' };
  }

  render () {

    return (
      <Modal
        isOpen={this.props.isOpen}
        onRequestClose={this.props.onRequestClose}
        className='import-collection-conflict-modal'
        customStyles={this.getCustomStyles()}
        customOverlayStyles={{ 'zIndex': 110 }}
      >
        <ModalHeader>COLLECTION EXISTS</ModalHeader>
        <ModalContent>
          <div className='import-collection-conflict-modal-message'>
            <span>A collection&nbsp;</span>
            <span className='import-collection-conflict-modal-entity-name'>{this.props.name}</span>
            <span>&nbsp;already exists.</span>
          </div>
          <div className='import-collection-conflict-modal-message'>
            <span>What would you like to do?</span>
          </div>
        </ModalContent>
        <ModalFooter>
          <Button
            type='primary'
            onClick={this.props.onCopy}
          >Import as Copy</Button>
          <Button
            type='secondary'
            onClick={this.props.onReplace}
          >Replace</Button>
        </ModalFooter>
      </Modal>
    );
  }
}
