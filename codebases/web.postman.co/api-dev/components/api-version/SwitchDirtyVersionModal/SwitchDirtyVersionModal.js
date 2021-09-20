import React, { Component } from 'react';
import { Button } from '../../../../js/components/base/Buttons';
import { Modal, ModalHeader, ModalContent, ModalFooter } from '../../../../js/components/base/Modals';
import KeyMaps from '../../../../js/components/base/keymaps/KeyMaps';

const MODAL_BUTTON_SAVE = 'save',
  MODAL_BUTTON_DISCARD = 'discard',
  MODAL_BUTTON_CANCEL = 'cancel',
  MODE_SWITCH_HEADER_TEXT = 'UNSAVED CHANGES',
  MODE_SWITCH_CONTENT = 'Save the schema before turning on comment mode to avoid losing your work.',
  MODE_SWITCH_SAVE = 'Save',
  VERSION_SWITCH_HEADER_TEXT = 'SAVE CHANGES?',
  VERSION_SWITCH_CONTENT = `This version has unsaved changes. Save before switching
    versions to avoid losing your work.`,
  VERSION_SWITCH_SAVE = 'Save Changes';

export default class SwitchDirtyVersionModal extends Component {
  constructor (props) {
    super(props);

    this.state = { focusedButton: MODAL_BUTTON_SAVE };

    this.handleClose = this.handleClose.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleDiscard = this.handleDiscard.bind(this);
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

  handleDiscard () {
    this.props.onDiscard && this.props.onDiscard();
  }

  getCustomStyles () {
    return { marginTop: '35vh' };
  }

  handleSwitchFocus (e) {
    e.stopPropagation();
    e.preventDefault();

    /**
     * In the use case of switching mode from build to comment we hide Discard Changes button
     * hence focus switching only consists of switching between save and cancel
     */
    let tabOrder = this.props.entityToSwitch === 'mode' ?
        [MODAL_BUTTON_CANCEL, MODAL_BUTTON_SAVE] :
        [MODAL_BUTTON_DISCARD, MODAL_BUTTON_CANCEL, MODAL_BUTTON_SAVE],
      currentFocus = _.findIndex(tabOrder, (tab) => { return tab === this.state.focusedButton; }),
      nextFocus = tabOrder[(currentFocus + 1) % tabOrder.length];

    this.setState({ focusedButton: nextFocus });
  }

  handleFocusClick () {
    switch (this.state.focusedButton) {
      case MODAL_BUTTON_DISCARD:
        this.handleDiscard();
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
        <ModalHeader>{this.props.entityToSwitch === 'mode' ? MODE_SWITCH_HEADER_TEXT : VERSION_SWITCH_HEADER_TEXT}</ModalHeader>
        <ModalContent>
          <div>{this.props.entityToSwitch === 'mode' ? MODE_SWITCH_CONTENT : VERSION_SWITCH_CONTENT}</div>
        </ModalContent>
        <ModalFooter>
          <KeyMaps keyMap={pm.shortcuts.getShortcuts()} handlers={this.getKeyMapHandlers()} ref={(component) => this.keyMapsRef = component}>
            <div className='unsaved-api-version-confirmation-modal__footer'>
              <div className='unsaved-api-version-confirmation-modal__footer__left'>
                {this.props.entityToSwitch === 'version' &&
                  (
                    <Button
                      type='secondary'
                      onClick={this.handleDiscard}
                      focused={this.state.focusedButton === MODAL_BUTTON_DISCARD}
                    >
                      Don't Save
                    </Button>
                  )
                }
              </div>
              <div className='unsaved-api-version-confirmation-modal__footer__right'>
                <Button
                  type='primary'
                  onClick={this.handleSave}
                  focused={this.state.focusedButton === MODAL_BUTTON_SAVE}
                >
                  {this.props.entityToSwitch === 'mode' ? MODE_SWITCH_SAVE : VERSION_SWITCH_SAVE}
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
