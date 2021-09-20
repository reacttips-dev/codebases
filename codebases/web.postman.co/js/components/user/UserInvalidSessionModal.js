import React, { Component } from 'react';
import { Button } from '../base/Buttons';
import { Modal, ModalHeader, ModalContent, ModalFooter } from '../base/Modals';
import KeyMaps from '../base/keymaps/KeyMaps';

export default class UserInvalidSessionModal extends Component {
  constructor (props) {
    super(props);
  }

  getKeymapHandlers () {
    return { 'submit': pm.shortcuts.handle('submit', this.props.onSignOut) };
  }

  getCustomStyles () {
    return { marginTop: '35vh' };
  }

  render () {
    // This modal should not be close-able

    return (
      <Modal
        customStyles={this.getCustomStyles()}
        isOpen={this.props.isOpen}
      >
        <ModalHeader>Session Expired</ModalHeader>
        <ModalContent>
          <KeyMaps keyMap={pm.shortcuts.getShortcuts()} handlers={this.getKeymapHandlers()}>
            <div>
              Your session has expired. Please sign in again.
            </div>
          </KeyMaps>
        </ModalContent>
        <ModalFooter>
          <Button
            type='secondary'
            onClick={this.props.onSignOut}
          >Sign Out</Button>
          <Button
            type='primary'
            onClick={this.props.onSignIn}
          >Sign In</Button>
        </ModalFooter>
      </Modal>
    );
  }
}
