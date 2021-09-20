import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
import {
  Modal, ModalHeader, ModalContent
} from '@postman-app-monolith/renderer/js/components/base/Modals';
import ManageHeaderPresetContainer from './ManageHeaderPresetContainer';

@pureRender
export default class ManageHeaderPresetModalContainer extends Component {
  constructor (props) {
    super(props);

    this.state = { isOpen: false };

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleDirtyStateOnClose = this.handleDirtyStateOnClose.bind(this);
  }

  UNSAFE_componentWillMount () {
    pm.mediator.on('showManageHeaderPresetModal', this.handleOpen);
  }

  componentWillUnmount () {
    pm.mediator.off('showManageHeaderPresetModal', this.handleOpen);
  }

  handleOpen () {
    this.setState({ isOpen: true });
  }

  handleClose () {
    this.setState({ isOpen: false });
  }

  handleDirtyStateOnClose () {
    if (this.refs.manageHeaderPresetContainer && this.refs.manageHeaderPresetContainer.isDirty()) {
      pm.mediator.trigger('showConfirmationModal', this.handleClose);
    } else {
      this.handleClose();
    }
  }

  getCustomStyles () {
    return {
      marginTop: '15vh',
      height: '70vh',
      width: '720px'
    };
  }

  render () {
    return (
      <Modal
        isOpen={this.state.isOpen}
        onRequestClose={this.handleDirtyStateOnClose}
        className='manage-header-preset-modal'
        customStyles={this.getCustomStyles()}
      >
        <ModalHeader>MANAGE HEADER PRESETS</ModalHeader>
        <ModalContent>
          <div className='manage-header-preset-modal-content-wrapper'>
            <ManageHeaderPresetContainer
              ref='manageHeaderPresetContainer'
            />
          </div>
        </ModalContent>
      </Modal>
    );
  }
}
