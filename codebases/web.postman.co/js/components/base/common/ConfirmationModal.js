import React, { Component } from 'react';
import { Button } from '../Buttons';
import { Modal, ModalContent, ModalFooter } from '../Modals';
import KeyMaps from '../keymaps/KeyMaps';

export default class ConfirmationModal extends Component {
  constructor (props) {
    super(props);

    this.state = { isDiscardFocused: false };
    this.handleClose = this.handleClose.bind(this);
    this.handleDiscard = this.handleDiscard.bind(this);
    this.handleFocusClick = this.handleFocusClick.bind(this);
    this.handleFocusSwitch = this.handleFocusSwitch.bind(this);
  }

  getKeyMapHandlers () {
    return {
      quit: pm.shortcuts.handle('quit', this.handleClose), // discard and close
      select: pm.shortcuts.handle('select', this.handleFocusClick), // save and close
      submit: pm.shortcuts.handle('submit', this.handleFocusClick), // save and close
      space: pm.shortcuts.handle('space', this.handleFocusClick), // submit based on what is in focus
      focusNext: pm.shortcuts.handle('focusNext', this.handleFocusSwitch) // switch to next button
    };
  }

  // to initially set focus on save button each time the modal is fired up
  UNSAFE_componentWillReceiveProps () {
    this.setState({
      isDiscardFocused: false
    }, () => {
      // componentDidUpdate will get called before ref get attached to any children of the modal
      // thus waiting for the whole event loop for re-rendering to finish before calling focus on ref
      requestIdleCallback(() => {
        this.keyMapsRef && this.keyMapsRef.focus();
      });
    });
  }

  handleClose () {
    this.props.onClose && this.props.onClose();
    this.setState({ isDiscardFocused: true });
  }

  handleDiscard () {
    this.props.onDiscard && this.props.onDiscard();
  }

  handleFocusSwitch () {
    this.setState({ isDiscardFocused: !this.state.isDiscardFocused });
  }

  handleFocusClick () {
    this.state.isDiscardFocused ? this.handleDiscard() : this.handleClose();
  }

  getCustomStyles () {
    return {
      marginTop: '0px',
      zIndex: 2000,
      width: '370px',
      borderRadius: '0px 0px 3px 3px'
    };
  }

  render () {

    return (
      <Modal
        isOpen={this.props.isOpen}
        onRequestClose={this.handleClose}
        className='confirmation-modal'
        customStyles={this.getCustomStyles()}
      >
        <ModalContent
          className='confirmation-modal__content'
        >
          <div className='confirmation-modal__body'>
            <div className='confirmation-modal__body__header'>
              Discard unsaved changes?
            </div>
            <div className='confirmation-modal__body__message'>
              Any changes you’ve made will be discarded.
            </div>
          </div>
          <KeyMaps
            keyMap={pm.shortcuts.getShortcuts()}
            handlers={this.getKeyMapHandlers()}
            ref={(component) => this.keyMapsRef = component}
          >
            <div className='confirmation-modal__footer'>
              <Button
                type='primary'
                className='confirmation-modal__discard-btn'
                onClick={this.handleDiscard}
                focused={this.state.isDiscardFocused}
              >
                Discard Changes
              </Button>
              <Button
                type='secondary'
                className='confirmation-modal__cancel-btn'
                onClick={this.handleClose}
                focused={!this.state.isDiscardFocused}
              >
                Cancel
              </Button>
            </div>
          </KeyMaps>
        </ModalContent>
      </Modal>
    );
  }
}
