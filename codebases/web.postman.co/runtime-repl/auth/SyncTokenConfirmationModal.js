import React, { Component } from 'react';
import { Button } from '@postman-app-monolith/renderer/js/components/base/Buttons';
import { Modal, ModalHeader, ModalContent } from '@postman-app-monolith/renderer/js/components/base/Modals';
import KeyMaps from '@postman-app-monolith/renderer/js/components/base/keymaps/KeyMaps';
import { getStore } from '@postman-app-monolith/renderer/js/stores/get-store';
import { getRequestIdFromResourceId } from '@postman-app-monolith/renderer/js/utils/EditorUtils';
import EditorService from '@postman-app-monolith/renderer/js/services/EditorService';
import CollectionController from '@@runtime-repl/collection/datastores/controllers/CollectionController';

export default class SyncTokenConfirmationModal extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isConfirmFocused: true
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleFocusClick = this.handleFocusClick.bind(this);
    this.handleFocusSwitch = this.handleFocusSwitch.bind(this);
    this.handleSaveAndSync = this.handleSaveAndSync.bind(this);
  }

  getKeyMapHandlers () {
    return {
      quit: pm.shortcuts.handle('quit', this.handleClose), // Discard and close
      select: pm.shortcuts.handle('select', this.handleFocusClick), // Save and close
      submit: pm.shortcuts.handle('submit', this.handleFocusClick), // Save and close
      space: pm.shortcuts.handle('space', this.handleFocusClick), // Submit based on what is in focus
      focusNext: pm.shortcuts.handle('focusNext', this.handleFocusSwitch) // Switch to next button
    };
  }

  getCustomStyles () {
    return {
      marginTop: '35vh',
      width: '400px'
    };
  }

  handleClose () {
    this.props.onRequestClose && this.props.onRequestClose();
  }

  handleSubmit () {
    this.props.onConfirm && this.props.onConfirm();
  }

  handleFocusSwitch () {
    this.setState((prev) => ({ isConfirmFocused: !prev.isConfirmFocused }));
  }

  handleFocusClick () {
    this.state.isConfirmFocused ? this.handleSubmit() : this.handleClose();
  }


  handleSaveAndSync () {
    const { callback, options: { editorId } } = this.props;

    this.handleClose();

    return EditorService.requestSave({ id: editorId })
      .then(() => {
        const currentResource = _.get(getStore('ActiveWorkspaceSessionStore'), ['editorsData', editorId, 'resource']),
          resourceId = getRequestIdFromResourceId(currentResource);

        // This is done to check whether the Request was created or not
        // as Promise is resolved even when user clicks on 'Cancel' in the
        // Add to Collection modal (triggered by `EditorService.requestSave()`).
        return CollectionController.getRequest({ id: resourceId });
      })
      .then((request) => {
        // If was saved, syn token via callback
        if (!_.isEmpty(request)) {
          _.isFunction(callback) && callback();
        }
      });
  }

  render () {
    const { action, saveBeforeSyncing } = this.props.options;

    let title,
      description,
      actionLabel,
      actionHandler;

    if (action === 'removeSyncedToken') {
      title = 'Remove synced token?';
      description = 'People with access to this request will no longer be able to see or use this token. They will be able to generate their own access token instead.';
      actionLabel = 'Remove Synced Token';
      actionHandler = this.handleSubmit;
    } else if (action === 'replaceSyncedToken') {
      title = 'Sync token?';
      description = 'This new token will replace the one that\'s currently synced. Anyone with access to the request will be able to view and use the new token.';
      actionLabel = 'Sync Token';
      actionHandler = this.handleSubmit;
    } else if (action === 'syncToken' && saveBeforeSyncing) {
      title = 'Save and sync token?';
      description = 'Request should be saved to sync the token. Syncing this token will allow anyone with access to this request to view and potentially use it.';
      actionLabel = 'Save and Sync Token';
      actionHandler = this.handleSaveAndSync;
    } else {
      title = 'Sync token?';
      description = 'Syncing this token will allow anyone with access to this request to view and potentially use it.';
      actionLabel = 'Sync Token';
      actionHandler = this.handleSubmit;
    }

    return (
      <Modal
        isOpen={this.props.isOpen}
        onRequestClose={this.handleClose}
        className='sync-token-confirmation-modal'
        customStyles={this.getCustomStyles()}
      >
        <ModalHeader>
          {title}
        </ModalHeader>
        <ModalContent>
          <KeyMaps
            keyMap={pm.shortcuts.getShortcuts()}
            handlers={this.getKeyMapHandlers()}
            ref={this.props.keymapRef}
          >
            <div>
              {description}
              <div className='sync-token-confirmation-modal__controls'>
                <Button
                  type='primary'
                  onClick={actionHandler}
                  className='sync-token-confirmation-modal__confirm-button'
                  focused={this.state.isConfirmFocused}
                >
                  {actionLabel}
                </Button>
                <Button
                  className='sync-token-confirmation-modal__cancel-button'
                  type='secondary'
                  onClick={this.handleClose}
                  focused={!this.state.isConfirmFocused}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </KeyMaps>
        </ModalContent>
      </Modal>
    );
  }
}
