import React, { Component } from 'react';
import { Button } from '../../components/base/Buttons';
import { Modal, ModalHeader, ModalContent } from '../../components/base/Modals';
import KeyMaps from '../../components/base/keymaps/KeyMaps';
import { createEvent } from '../../modules/model-event';
import dispatchUserAction from '../../modules/pipelines/user-action';

export default class AddAccountConfirmationModal extends Component {
  constructor (props) {
    super(props);
    this.state = { isOpen: false };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
  }

  UNSAFE_componentWillMount () {
    pm.mediator.on('showAddAccountConfirmation', this.handleOpen);
  }

  componentWillUnmount () {
    pm.mediator.off('showAddAccountConfirmation', this.handleOpen);
  }


  getKeyMapHandlers () {
    return {
      quit: pm.shortcuts.handle('quit', this.handleClose), // discard and close
      select: pm.shortcuts.handle('select', this.handleSubmit), // save and close
      submit: pm.shortcuts.handle('submit', this.handleSubmit) // save and close
    };
  }

  handleOpen () {
    this.setState({ isOpen: true });
  }

  handleClose () {
    this.setState({ isOpen: false });
  }

  handleSubmit () {
    dispatchUserAction(createEvent('add', 'users'));
  }

  getCustomStyles () {
    return { marginTop: '35vh' };
  }

  render () {
    return (
      <Modal
        customStyles={this.getCustomStyles()}
        isOpen={this.state.isOpen}
        onRequestClose={this.handleClose}
      >
        <ModalHeader>Add account</ModalHeader>
        <ModalContent>
          <KeyMaps
            handlers={this.getKeyMapHandlers()}
            keyMap={pm.shortcuts.getShortcuts()}
            ref={this.props.keymapRef}
          >
            <div>
              <div className='delete-confirmation-modal__message'>
                Adding new account will close other windows open with your current account. You might lose any unsaved work.
                <div className='delete-confirmation-modal-message'>
                  <span>Are you sure you wish to proceed?</span>
                </div>
              </div>
              <div className='delete-confirmation-modal-controls'>
                <Button
                  className='delete-confirmation-modal-delete-button'
                  type='primary'
                  onClick={this.handleSubmit}
                >Close windows and add new account</Button>
                <Button
                  className='delete-confirmation-modal-cancel-button'
                  type='secondary'
                  onClick={this.handleClose}
                >Cancel</Button>
              </div>
            </div>
          </KeyMaps>
        </ModalContent>
      </Modal>
    );
  }
}
