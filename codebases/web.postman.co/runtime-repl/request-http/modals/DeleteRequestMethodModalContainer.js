import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
import dispatchUserAction from '@postman-app-monolith/renderer/js/modules/pipelines/user-action';
import { createEvent } from '@postman-app-monolith/renderer/js/modules/model-event';
import DeleteConfirmationModal from '@postman-app-monolith/renderer/js/components/collections/DeleteConfirmationModal';

@pureRender
export default class DeleteRequestMethodModalContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isOpen: false,
      method: null,
      isDisabled: false
    };

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
  }

  UNSAFE_componentWillMount () {
    pm.mediator.on('showDeleteRequestMethodModal', this.handleOpen);
  }

  componentWillUnmount () {
    pm.mediator.off('showDeleteRequestMethodModal', this.handleOpen);
  }

  handleOpen (method, callback) {
    if (!method) {
      return;
    }

    this.callback = callback;
    this.setState({
      isOpen: true,
      method
    }, () => {
      _.invoke(this, 'keymapRef.focus');
    });
  }

  handleClose () {
    this.callback = null;
    this.setState({
      isOpen: false,
      method: null,
      isDisabled: false
    }, () => {
      pm.mediator.trigger('focusBuilder');
    });
  }

  handleConfirm () {
    this.setState({ isDisabled: true });

    const deleteRequestMethodEvent = createEvent('removeMethod', 'requestmethod', this.state.method);

    dispatchUserAction(deleteRequestMethodEvent)
      .then(() => {
        this.callback && this.callback();
        this.handleClose();
      })
      .catch((err) => {
        this.setState({ isDisabled: false });
        pm.toasts.error('Unable to delete this method');
        pm.logger.error('Error in pipeline for deleting request method', err);
      });
  }

  render () {
    return (
      <DeleteConfirmationModal
        isDisabled={this.state.isDisabled}
        entity='METHOD'
        message='Are you sure you want to delete this method?'
        primaryAction={this.state.isDisabled ? 'Deleting' : 'Delete'}
        preventFocusReset
        isOpen={this.state.isOpen}
        keymapRef={(ref) => { this.keymapRef = ref; }}
        onConfirm={this.handleConfirm}
        onRequestClose={this.handleClose}
      />
    );
  }
}
