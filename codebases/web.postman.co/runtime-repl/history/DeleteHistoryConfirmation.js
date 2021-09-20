import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
import DeleteConfirmationModal from '@postman-app-monolith/renderer/js/components/collections/DeleteConfirmationModal';

const DELETE_ALL_HISTORY_ACTION = 'all',
  DELETE_SELECTED_HISTORY_ACTION = 'selected';

@pureRender
export default class DeleteHistoryConfirmation extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isOpen: false,
      isDeleting: false
    };

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.onConfirm = null;
  }

  UNSAFE_componentWillMount () {
    pm.mediator.on('showDeleteHistoryModal', this.handleOpen);
  }

  componentWillUnmount () {
    pm.mediator.off('showDeleteHistoryModal', this.handleOpen);
  }

  handleOpen (onConfirm, options) {
    this.onConfirm = onConfirm;
    this.options = options || {};
    this.setState({
      isOpen: true,
      isDeleting: false
    }, () => {
      _.invoke(this, 'keymapRef.focus');
    });
  }

  handleClose () {
    this.setState({ isOpen: false }, () => {
      pm.mediator.trigger('focusSidebar');
      this.onConfirm = null;
    });
  }

  handleConfirm () {
    this.setState({ isDeleting: true }, () => Promise.resolve()
      .then(() => this.onConfirm && this.onConfirm())
      .then(() => {
        this.handleClose();
      })
      .catch(() => {
        pm.logger.warn('DeleteHistoryConfirmation~handleConfirm: Could not delete history');
        this.handleClose();
      }));
  }

  getModalMessage (identifier) {
    switch (identifier) {
      case DELETE_ALL_HISTORY_ACTION:
        return 'Are you sure you want to clear all your history requests for this workspace?';

      case DELETE_SELECTED_HISTORY_ACTION:
        return 'Are you sure you want to clear all the selected history requests from this workspace?';

      default:
        return 'Are you sure you want to clear all the selected history requests from this workspace?';
    }
  }

  render () {
    const identifier = this.options && this.options.identifier || 'selected',
      message = this.getModalMessage(identifier);

    return (
      <DeleteConfirmationModal
        preventFocusReset
        entity='HISTORY'
        isOpen={this.state.isOpen}
        keymapRef={(ref) => { this.keymapRef = ref; }}
        onConfirm={this.handleConfirm}
        onRequestClose={this.handleClose}
        message={message}
        isDeleting={this.state.isDeleting}
      />
    );
  }
}
