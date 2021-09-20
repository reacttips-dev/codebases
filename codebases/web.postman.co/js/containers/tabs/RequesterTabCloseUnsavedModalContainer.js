import React, { Component } from 'react';
import { computed, reaction } from 'mobx';
import { observer } from 'mobx-react';
import classnames from 'classnames';

import { Button } from '../../components/base/Buttons';
import { Checkbox } from '../../components/base/Inputs';
import { Modal, ModalHeader, ModalContent, ModalFooter } from '../../components/base/Modals';
import KeyMaps from '../../components/base/keymaps/KeyMaps';
import {
  MODAL_BUTTON_SAVE,
  MODAL_BUTTON_SAVE_AS,
  MODAL_BUTTON_CANCEL,
  MODAL_BUTTON_DISCARD
} from '../../constants/ModalButtonsConstants';
import { SKIP_CONFIRMATION_BEFORE_CLOSE, CATEGORY_EDITOR } from '../../constants/SettingsGeneralConstants';
import { getStore } from '../../stores/get-store';
import EditorService from '../../services/EditorService';
import dispatchUserAction from '../../modules/pipelines/user-action';
import { createEvent } from '../../modules/model-event';
import {
  DISABLED_TOOLTIP_IS_OFFLINE
} from '@@runtime-repl/_common/DisabledTooltipConstants';

const TAB_NAME_LENGTH = 40;

/**
 * This Modal is used for both save cases as well as closing cases.
 *
 * Closing a resource actions in order
 *  1. Dirty with no conflict:
 *      This tab TAB_NAME has unsaved changes which will be lost if you choose to close it. Save these changes to avoid losing your work.
 *
 *      Don't save - Cancel - Save changes
 *
 *  2. Dirty with Update conflict:
 *      This tab TAB_NAME has unsaved changes which will be lost if you choose to close it. This MODEL_NAME has been modified from another tab.
 *      Saving these changes will overwrite the MODEL_NAME.
 *
 *      Discard changes in a Tab - Save and overwrite - Save as a new MODEL_NAME
 *
 *  3. Dirty with Delete conflict:
 *      This tab TAB_NAME has unsaved changes which will be lost if you choose to close it. Save these changes to avoid losing your work.
 *
 *      Don't save - Cancel - Save
 *
 * Saving a resource actions
 *  1. Update conflict:
 *     This tab TAB_NAME has unsaved changes which will be lost if you choose to close it. This MODEL_NAME has been modified from another tab.
 *     Saving these changes will overwrite the MODEL_NAME.
 *
 *     Cancel - Save and overwrite - Save as a new MODEL_NAME
 *
 */

@observer
export default class RequesterTabCloseUnsavedModalContainer extends Component {
  @computed
  get currentClosingEditorId () {
    return getStore('TabUIStore').closingTabId;
  }

  @computed
  get requestingSaveTabId () {
    return getStore('TabUIStore').requestingSaveTabId;
  }

  @computed
  get requestConfirmationFor () {
    return this.requestingSaveTabId || this.currentClosingEditorId;
  }

  @computed
  get editorForConfirmation () {
    let editor = getStore('EditorStore').find(this.requestConfirmationFor);

    return editor;
  }

  @computed
  get editorModelForConfirmation () {
    let editor = getStore('EditorStore').find(this.requestConfirmationFor);

    return editor && editor.model;
  }

  @computed
  get isClosing () {
    return this.requestConfirmationFor === this.currentClosingEditorId;
  }

  @computed
  get allowDiscard () {
    // allow discard only if we are closing the tab
    return this.isClosing;
  }

  @computed
  get isConflicted () {
    return this.editorModelForConfirmation && this.editorModelForConfirmation.isConflicted;
  }

  @computed
  get allowSaveAs () {
    return this.isConflicted;
  }

  @computed
  get tabOrder () {
    let editorModel = this.editorModelForConfirmation,
        conflictType = editorModel && editorModel.conflictState && editorModel.conflictState.type,
        isV2Implementation = !EditorService.isLegacy(this.editorForConfirmation) && !EditorService.isV1Compatible(this.editorForConfirmation),
        tabOrder = [];

    if (conflictType === 'updated' || isV2Implementation) {
      // as it is conflicted then we need to check whether this is a save operation
      // or a closing operation, save has 'Cancel' and close has 'Discard'
      if (this.isClosing) {
        tabOrder = [MODAL_BUTTON_DISCARD, MODAL_BUTTON_SAVE, MODAL_BUTTON_SAVE_AS];
      } else {
        tabOrder = [MODAL_BUTTON_CANCEL, MODAL_BUTTON_SAVE, MODAL_BUTTON_SAVE_AS];
      }

      let conflictOptions = isV2Implementation && editorModel.getConflictOptions();

      if (!conflictOptions.saveAs) {
        tabOrder.pop();
      }
    } else if (conflictType === 'deleted') {
      tabOrder = [MODAL_BUTTON_DISCARD, MODAL_BUTTON_CANCEL, MODAL_BUTTON_SAVE_AS];
    } else {
      tabOrder = [MODAL_BUTTON_DISCARD, MODAL_BUTTON_CANCEL, MODAL_BUTTON_SAVE];
    }

    return tabOrder;
  }

  constructor (props) {
    super(props);

    this.state = { focusedButton: MODAL_BUTTON_SAVE };

    this.handleCancel = this.handleUserAction.bind(this, MODAL_BUTTON_CANCEL);
    this.handleSave = this.handleUserAction.bind(this, MODAL_BUTTON_SAVE);
    this.handleSaveAs = this.handleUserAction.bind(this, MODAL_BUTTON_SAVE_AS);
    this.handleDiscard = this.handleUserAction.bind(this, MODAL_BUTTON_DISCARD);
    this.handleSwitchFocus = this.handleSwitchFocus.bind(this);
    this.handleFocusClick = this.handleFocusClick.bind(this);
    this.getCustomStyles = this.getCustomStyles.bind(this);
    this.getKeyMapHandlers = this.getKeyMapHandlers.bind(this);
    this.getModalContentsForSave = this.getModalContentsForSave.bind(this);
    this.getModalContentsForClose = this.getModalContentsForClose.bind(this);
    this.getUnsavedModalFooter = this.getUnsavedModalFooter.bind(this);
    this.getConflictedModalFooterForDeleted = this.getConflictedModalFooterForDeleted.bind(this);
    this.getConflictedModalFooterForUpdated = this.getConflictedModalFooterForUpdated.bind(this);
    this.updateShowConfirmationModalSetting = this.updateShowConfirmationModalSetting.bind(this);
    this.toggleShowConfirmationModalSetting = this.toggleShowConfirmationModalSetting.bind(this);

    // componentDidUpdate will get called before ref get attached to any children of the modal
    // so ideally we need to wait for the whole event loop for re rendering to finish, attaching the ref
    // to it and then calling focus on ref
    // if directly called inside the set state callback the ref remains undefined
    // https://github.com/reactjs/react-modal/issues/338
    reaction(() => this.requestConfirmationFor, () => {
      this.setState({
        focusedButton: MODAL_BUTTON_SAVE,
        currentSkipConfirmationModalSetting: false
      }, () => {
        requestIdleCallback(() => {
          this.keyMapsRef && this.keyMapsRef.focus();
        });
      });
    });
  }

  handleUserAction (action) {
    return Promise.resolve()
      .then(() => {
        return this.updateShowConfirmationModalSetting(action);
      })
      .then(() => {
        switch (action) {
          case MODAL_BUTTON_DISCARD:
            this.handleDiscardAction();
            break;
          case MODAL_BUTTON_CANCEL:
            this.handleCancelAction();
            break;
          case MODAL_BUTTON_SAVE:
            this.handleSaveAction();
            break;
          case MODAL_BUTTON_SAVE_AS:
            this.handleSaveAsAction();
            break;
          default:
            return;
        }
      });
  }

  handleCancelAction () {
    // (Cancel Button)

    // if this modal shows up for cancel, terminate pending cancel
    if (this.isClosing) {
      EditorService.cancelClose();
    }

    // else this modal is open because there is a pending save, so cancel that
    else {
      EditorService.cancelSave();
    }
  }

  handleSaveAction () {
    let confirmationTabId = this.requestConfirmationFor;

    return EditorService.save({ id: confirmationTabId }, { closeOnSave: this.isClosing });
  }

  handleSaveAsAction () {
    let confirmationTabId = this.requestConfirmationFor;

    return EditorService.saveAs({ id: confirmationTabId }, { closeOnSave: this.isClosing });
  }

  handleDiscardAction () {
    let currentClosingEditorId = this.currentClosingEditorId;

    return EditorService.close({ id: currentClosingEditorId }, { force: true });
  }

  handleSwitchFocus (e) {
    e.stopPropagation();
    e.preventDefault();

    let currentFocus = _.findIndex(this.tabOrder, (tab) => {
        return tab === this.state.focusedButton;
      }),
      nextFocus;

    nextFocus = this.tabOrder[(currentFocus + 1) % this.tabOrder.length];
    this.setState({ focusedButton: nextFocus });
  }

  getCustomStyles () {
    return { marginTop: '35vh' };
  }

  toggleShowConfirmationModalSetting () {
    this.setState({ currentSkipConfirmationModalSetting: !this.state.currentSkipConfirmationModalSetting });
  }

  updateShowConfirmationModalSetting (action) {
    // early bail out if action is cancel, or if the setting has not been changed
    // assuming this modal will only open when skipConfirmationModal setting is false, hence updating only when it becomes true.
    if (action === MODAL_BUTTON_CANCEL || !this.state.currentSkipConfirmationModalSetting) {
      return Promise.resolve();
    }

    // update the setting
    return dispatchUserAction(createEvent('update', 'userconfigs', { [`${CATEGORY_EDITOR}.${SKIP_CONFIRMATION_BEFORE_CLOSE}`]: this.state.currentSkipConfirmationModalSetting }))
      .catch(() => {
        pm.toasts.error('Something went wrong while saving your preference');
      });
  }

  getKeyMapHandlers () {
    return {
      quit: pm.shortcuts.handle('quit', this.props.handleCancel), // cancel closing tab
      select: pm.shortcuts.handle('select', this.handleFocusClick), // save and close
      submit: pm.shortcuts.handle('submit', this.handleFocusClick), // save and close
      space: pm.shortcuts.handle('space', this.handleFocusClick), // select whichever is highlighted
      focusNext: pm.shortcuts.handle('focusNext', this.handleSwitchFocus) // focus next item
    };
  }

  handleFocusClick () {
    this.handleUserAction(this.state.focusedButton);
  }

  // used to populate the modal body for close
  getModalContentsForClose (name, modelType, conflictType, isV2Implementation) {
    return (
      <div>This tab
        <span className='tab-unsaved-confirmation-modal_body-title'> {_.truncate(name, { length: TAB_NAME_LENGTH }) } </span>
        has unsaved changes which will be lost if you choose to close it.
        {(conflictType === 'updated' || isV2Implementation) ?
          ` This ${modelType} has been modified from another tab. Saving these changes will overwrite the ${modelType}.` :
          ' Save these changes to avoid losing your work.'
        }
      </div>
    );
  }

  // used to populate the modal body for save actions
  getModalContentsForSave (name, modelType, conflictType, isV2Implementation) {
    return (
      <div>This tab
        <span className='tab-unsaved-confirmation-modal_body-title'> {_.truncate(name, { length: TAB_NAME_LENGTH }) } </span>
        {(conflictType === 'updated' || isV2Implementation) &&
          `has been modified from another tab. Saving these changes will overwrite the ${modelType}.`
        }
      </div>
    );
  }

  // used to populated the footer where the modal is in conflicted state
  // handles both cases whether the editor is being closed or is being saved
  getConflictedModalFooterForUpdated (isClosing, modelType, isV2Implementation, conflictOptions) {
    let secondaryButtonText = 'Discard changes in this tab',
        onClickHandlerForSecondaryButton = this.handleDiscard,
        buttonConstant = MODAL_BUTTON_DISCARD;

    // if it is not closing, then it comes here because of the save action
    // hence buttonText, and handler need to be changed accordingly
    if (!isClosing) {
      secondaryButtonText = 'Cancel';
      onClickHandlerForSecondaryButton = this.handleCancel;
      buttonConstant = MODAL_BUTTON_CANCEL;
    }

    return (
      <div className='tab-unsaved-confirmation-modal__footer-wrapper conflict'>
        <div className='tab-unsaved-confirmation-modal__footer-actions'>
          <div className='tab-unsaved-confirmation-modal__footer__left'>
            <Button
              className={isClosing && 'large'}
              type='secondary'
              onClick={onClickHandlerForSecondaryButton}
              focused={this.state.focusedButton === buttonConstant}
            >
              {secondaryButtonText}
            </Button>
          </div>
          <div className='tab-unsaved-confirmation-modal__footer__right'>
            <Button
              className='large'
              type='primary'
              onClick={this.handleSave}
              focused={this.state.focusedButton === MODAL_BUTTON_SAVE}
            >
              Save and overwrite
            </Button>
          </div>
        </div>
        <div className='tab-unsaved-confirmation-modal__footer-additional-actions'>
          {(!isV2Implementation || (isV2Implementation && conflictOptions.saveAs)) &&
            <Button
              className='large'
              type='text'
              onClick={this.handleSaveAs}
              focused={this.state.focusedButton === MODAL_BUTTON_SAVE_AS}
            >
              {`Save as a new ${modelType}`}
            </Button>
          }
        </div>
      </div>
    );

  }

  // this is used to get the footer actions for the case where the resource is deleted
  // the footer remains same whether we are closing it or saving it
  getConflictedModalFooterForDeleted () {
    return (
      <div className='tab-unsaved-confirmation-modal__footer-wrapper'>
        <div className='tab-unsaved-confirmation-modal__footer-actions'>
          <div className='tab-unsaved-confirmation-modal__footer__left'>
            <Button
              type='secondary'
              onClick={this.handleDiscard}
              focused={this.state.focusedButton === MODAL_BUTTON_DISCARD}
            >
              Don't save
            </Button>
          </div>
          <div className='tab-unsaved-confirmation-modal__footer__right'>
            <Button
              type='primary'
              onClick={this.handleSaveAs}
              focused={this.state.focusedButton === MODAL_BUTTON_SAVE_AS}
            >
              Save
            </Button>
            <Button
              type='secondary'
              onClick={this.handleCancel}
              focused={this.state.focusedButton === MODAL_BUTTON_CANCEL}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  getTooltipForSaveChanges (userCanSave) {
    if (!userCanSave) {
      return DISABLED_TOOLTIP_IS_OFFLINE;
    }
  }

  // this is the modal footer which is used in cases where the tab is not in a conflicted state
  // i.e. neither deleted nor conflicted
  getUnsavedModalFooter () {
    const { userCanSave } = getStore('OnlineStatusStore');

    return (
      <div className='tab-unsaved-confirmation-modal__footer-wrapper'>
        <div className='tab-unsaved-confirmation-modal__footer-actions'>
          <div className='tab-unsaved-confirmation-modal__footer__left'>
            <Button
              type='secondary'
              onClick={this.handleDiscard}
              focused={this.state.focusedButton === MODAL_BUTTON_DISCARD}
            >
              Don't save
            </Button>
          </div>
          <div className='tab-unsaved-confirmation-modal__footer__right'>
            <Button
              type='primary'
              onClick={this.handleSave}
              focused={this.state.focusedButton === MODAL_BUTTON_SAVE}
              disabled={!userCanSave}
              tooltip={this.getTooltipForSaveChanges(userCanSave)}
            >
              Save changes
            </Button>
            <Button
              type='secondary'
              onClick={this.handleCancel}
              focused={this.state.focusedButton === MODAL_BUTTON_CANCEL}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  getConfirmationModalToggleSettingContent () {
    return (
      <div className='tab-unsaved-confirmation-modal--open-modal-confirmation-container'>
        <div className='tab-unsaved-confirmation-modal--confirmation-setting'>
            <div className='confirmation-checkbox'>
              <Checkbox
                checked={this.state.currentSkipConfirmationModalSetting}
                onChange={this.toggleShowConfirmationModalSetting}
              />
              <span className='confirmation-text'>Always discard unsaved changes when closing a tab</span>
            </div>
        </div>
        <div className='confirmation-helper-text'>
          You'll no longer be prompted to save changes when closing a tab. You can change this anytime from your Settings.
        </div>
      </div>
    );
  }

  // @note - this is a workaround to this issue https://postmanlabs.atlassian.net/browse/APIDEVP-1238.
  // this renders the modal footer based on whether tab is in a conflicted state or not and if yes, than return
  // footer based on conflict type i.e., either 'updated' or 'deleted' else, render footer for unsaved changes
  getModalFooter (conflictType, modelType, isV2Implementation, conflictOptions) {
    if (this.isConflicted && conflictType === 'deleted') {
      return this.getConflictedModalFooterForDeleted();
    }

    if (this.isConflicted && (conflictType === 'updated' || isV2Implementation)) {
      return this.getConflictedModalFooterForUpdated(this.isClosing, modelType, isV2Implementation, conflictOptions);
    }

    return this.getUnsavedModalFooter();
  }

  getModalFooterClasses (isConflicted) {
    return classnames({ 'tab-unsaved-confirmation-modal__footer': true, 'conflict': isConflicted });
  }

  render () {
    let confirmationTabId = this.requestConfirmationFor,
        isOpen = Boolean(confirmationTabId);

    if (!isOpen) {
      return false;
    }


    let editor = getStore('EditorStore').find(confirmationTabId),
        editorModel = editor && editor.model;

    if (!editorModel) {
      return false;
    }

    let name = editorModel && editorModel.name || '',
        modelType = editorModel && editorModel.userFriendlyResourceName,
        closingEditorsCount = getStore('EditorStore').closingEditorsCount,
        showConfirmationModal = (closingEditorsCount === 1 && this.isClosing),
        conflictType = '',
        conflictOptions = '',
        isV2Implementation = !EditorService.isLegacy(editor) && !EditorService.isV1Compatible(editor);

    if (this.isConflicted) {
      conflictType = (editorModel.conflictState && editorModel.conflictState.type);
      conflictOptions = isV2Implementation && editorModel.getConflictOptions();
    }

    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={this.handleCancel}
        className='tab-unsaved-confirmation-modal'
        customStyles={this.getCustomStyles()}
      >
         {/* Modal Header Section*/}
        <ModalHeader>DO YOU WANT TO SAVE?</ModalHeader>

        {/* Modal Content Section */}
        <ModalContent>
          {this.isClosing ? this.getModalContentsForClose(name, modelType, conflictType, isV2Implementation) : this.getModalContentsForSave(name, modelType, conflictType, isV2Implementation)}

          {/* Checkbox for confirmation close modal setting toggle */}
          { showConfirmationModal && this.getConfirmationModalToggleSettingContent() }
        </ModalContent>

        {/* Modal Content Section */}
        <ModalFooter className={this.getModalFooterClasses(this.isConflicted)}>
          <KeyMaps keyMap={pm.shortcuts.getShortcuts()} handlers={this.getKeyMapHandlers()} ref={(component) => this.keyMapsRef = component}>
            { this.getModalFooter(conflictType, modelType, isV2Implementation, conflictOptions) }
          </KeyMaps>
        </ModalFooter>

      </Modal>
    );
  }
}


