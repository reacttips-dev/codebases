import React, { PureComponent } from 'react';
import DeleteConfirmationModal from '@postman-app-monolith/renderer/js/components/collections/DeleteConfirmationModal';

export default class DeleteEnvironmentContainer extends PureComponent {
  constructor (props) {
    super(props);

    this.state = {
      isOpen: false,
      name: '',
      isDisabled: false
    };

    this.handleOpen = this.handleOpen.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.clean = this.clean.bind(this);
  }

  UNSAFE_componentWillMount () {
    pm.mediator.on('showEnvironmentDeleteModal', this.handleOpen);
  }

  componentWillUnmount () {
    pm.mediator.off('showEnvironmentDeleteModal', this.handleOpen);
  }

  getMessage () {
    if (pm.isScratchpad) {
      return (
        <div className='delete-confirmation-modal-message'>All local data of the environment will be permanently deleted from your machine.</div>
      );
    }

    return (
      <div className='delete-confirmation-modal-message'>
        <div>
          Deleting this environment might cause any monitors or mock servers using it to stop functioning properly.
          Are you sure you want to continue?
        </div>
      </div>
    );
  }

  handleOpen ({ name } = {}, callback) {
    if (!callback) {
      pm.logger.error('DeleteEnvironmentContainer~handleOpen - Required argument callback missing');

      return;
    }

    this.callback = callback;
    this.setState({
      isOpen: true,
      name
    }, () => {
      _.invoke(this, 'keymapRef.focus');
    });
  }


  handleCancel () {
    this.callback(null, false);
    this.clean();
  }

  async handleConfirm () {
    this.setState({ isDisabled: true });
    try {
      await this.callback(null, true);
      this.clean();
    } catch (err) {
      pm.logger.error('DeleteEnvironmentContainer~handleConfirm', err);

      this.setState({ isDisabled: false });
    }
  }

  clean () {
    this.callback = _.noop;
    this.setState({
      isOpen: false,
      name: '',
      isDisabled: false
    });
  }

  render () {
    return (
      <DeleteConfirmationModal
        preventFocusReset
        isDisabled={this.state.isDisabled}
        className='delete-collection-confirmation-modal'
        title={pm.isScratchpad ? 'DELETE ENVIRONMENT FROM SCRATCH PAD?' : 'DELETE ENVIRONMENT'}
        primaryAction={this.state.isDisabled ? 'Deleting' : 'Delete'}
        message={this.getMessage()}
        isOpen={this.state.isOpen}
        keymapRef={(ref) => { this.keymapRef = ref; }}
        meta={{ name: this.state.name }}
        onConfirm={this.handleConfirm}
        onRequestClose={this.handleCancel}
      />
    );
  }
}
