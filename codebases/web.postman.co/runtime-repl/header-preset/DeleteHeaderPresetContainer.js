import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
import dispatchUserAction from '@postman-app-monolith/renderer/js/modules/pipelines/user-action';
import { getStore } from '@postman-app-monolith/renderer/js/stores/get-store';
import { createEvent } from '@postman-app-monolith/renderer/js/modules/model-event';
import DeleteConfirmationModal from '@postman-app-monolith/renderer/js/components/collections/DeleteConfirmationModal';

@pureRender
export default class DeleteHeaderPresetContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isOpen: false,
      id: null,
      meta: null,
      isDisabled: false
    };

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
  }

  UNSAFE_componentWillMount () {
    pm.mediator.on('showHeaderPresetDeleteModal', this.handleOpen);
  }

  componentWillUnmount () {
    pm.mediator.off('showHeaderPresetDeleteModal', this.handleOpen);
  }

  handleOpen (headerPresetId, callback) {
    this.callback = _.isFunction(callback) && callback;
    this.setState({
      isOpen: true,
      id: headerPresetId,
      meta: {}
    }, () => {
      _.invoke(this, 'keymapRef.focus');
    });
  }

  handleClose () {
    this.callback = null;
    this.setState({
      isOpen: false,
      id: null,
      meta: null,
      isDisabled: false
    });
  }

  handleConfirm () {
    const currentUser = getStore('CurrentUserStore'),
      deleteHeaderPresetEvent = createEvent('delete', 'headerpreset', { id: this.state.id, owner: currentUser.id });

    this.setState({ isDisabled: true });
    dispatchUserAction(deleteHeaderPresetEvent)
      .then(() => {
        this.handleClose();
      })
      .catch((err) => {
        this.setState({ isDisabled: false });
        pm.toasts.error('Unable to delete this header preset');
        pm.logger.error('Could not delete header preset', err);
      });
  }

  getMessage () {
    return (
      <div className='delete-confirmation-modal-message'>
        <div>Are you sure you want to delete this header preset from the workspace?</div>
      </div>
    );
  }

  render () {
    return (
      <DeleteConfirmationModal
        preventFocusReset
        isDisabled={this.state.isDisabled}
        className='delete-collection-confirmation-modal'
        title='DELETE HEADER PRESET'
        primaryAction={this.state.isDisabled ? 'Deleting' : 'Delete'}
        message={this.getMessage()}
        isOpen={this.state.isOpen}
        keymapRef={(ref) => { this.keymapRef = ref; }}
        meta={this.state.meta}
        onConfirm={this.handleConfirm}
        onRequestClose={this.handleClose}
      />
    );
  }
}
