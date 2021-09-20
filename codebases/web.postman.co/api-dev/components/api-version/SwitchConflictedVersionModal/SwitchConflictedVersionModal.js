import React, { Component } from 'react';
import { Button } from '../../../../js/components/base/Buttons';
import { Modal, ModalHeader, ModalContent, ModalFooter } from '../../../../js/components/base/Modals';
import KeyMaps from '../../../../js/components/base/keymaps/KeyMaps';

const MODAL_BUTTON_SAVE = 'save',
  MODAL_BUTTON_SAVEAS = 'saveas',
  MODAL_BUTTON_CANCEL = 'cancel';
export default class SwitchConflictedVersionModal extends Component {
  constructor (props) {
    super(props);

    this.state = { focusedButton: MODAL_BUTTON_SAVE };

    this.handleClose = this.handleClose.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleSaveAs = this.handleSaveAs.bind(this);
    this.handleSwitchFocus = this.handleSwitchFocus.bind(this);
    this.handleFocusClick = this.handleFocusClick.bind(this);
    this.getKeyMapHandlers = this.getKeyMapHandlers.bind(this);
  }

  // to initially set focus on save button each time the modal is fired up
  UNSAFE_componentWillReceiveProps () {
    this.setState({
      focusedButton: MODAL_BUTTON_SAVE
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
  }

  handleSave () {
    this.props.onSave && this.props.onSave();
  }

  handleSaveAs () {
    this.props.onSaveAs && this.props.onSaveAs();
  }

  getCustomStyles () {
    return { marginTop: '35vh' };
  }

  handleSwitchFocus (e) {
    e.stopPropagation();
    e.preventDefault();

    let tabOrder = [MODAL_BUTTON_SAVEAS, MODAL_BUTTON_CANCEL, MODAL_BUTTON_SAVE],
      currentFocus = _.findIndex(tabOrder, (tab) => { return tab === this.state.focusedButton; }),
      nextFocus = tabOrder[(currentFocus + 1) % tabOrder.length];

    this.setState({ focusedButton: nextFocus });
  }

  handleFocusClick () {
    switch (this.state.focusedButton) {
      case MODAL_BUTTON_SAVEAS:
        this.handleSaveAs();
        break;
      case MODAL_BUTTON_CANCEL:
        this.handleClose();
        break;
      case MODAL_BUTTON_SAVE:
        this.handleSave();
        break;
      default:
        return;
    }
  }

  getKeyMapHandlers () {
    return {
      quit: pm.shortcuts.handle('quit', this.props.handleClose), // cancel closing tab
      select: pm.shortcuts.handle('select', this.handleFocusClick), // save and close
      submit: pm.shortcuts.handle('submit', this.handleFocusClick), // save and close
      space: pm.shortcuts.handle('space', this.handleFocusClick), // select whichever is highlighted
      focusNext: pm.shortcuts.handle('focusNext', this.handleSwitchFocus) // focus next item
    };
  }

  render () {
    return (
      <Modal
        isOpen={this.props.isOpen}
        onRequestClose={this.handleClose}
        className='unsaved-api-version-confirmation-modal'
        customStyles={this.getCustomStyles()}
      >
        <ModalHeader>DO YOU WANT TO SAVE?</ModalHeader>
        <ModalContent>
          <div>This version has unsaved changes. Save before switching versions to avoid losing your work.
          </div>
        </ModalContent>
        <ModalFooter>
          <KeyMaps keyMap={pm.shortcuts.getShortcuts()} handlers={this.getKeyMapHandlers()} ref={(component) => this.keyMapsRef = component}>
            <div className='unsaved-api-version-confirmation-modal__footer'>
              <div className='unsaved-api-version-confirmation-modal__footer__left'>
                <Button
                  type='secondary'
                  onClick={this.handleSaveAs}
                  focused={this.state.focusedButton === MODAL_BUTTON_SAVEAS}
                >
                Save as new API
                </Button>
              </div>
              <div className='unsaved-api-version-confirmation-modal__footer__right'>
                <Button
                  type='primary'
                  onClick={this.handleSave}
                  focused={this.state.focusedButton === MODAL_BUTTON_SAVE}
                >
                  Save Changes
                </Button>
                <Button
                  type='secondary'
                  onClick={this.handleClose}
                  focused={this.state.focusedButton === MODAL_BUTTON_CANCEL}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </KeyMaps>
        </ModalFooter>
      </Modal>
    );
  }
}
