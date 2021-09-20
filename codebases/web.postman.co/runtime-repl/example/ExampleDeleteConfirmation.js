import React, { Component } from 'react';
import DeleteConfirmationModal from '@postman-app-monolith/renderer/js/components/collections/DeleteConfirmationModal';

export default class ExampleDeleteConfirmation extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isOpen: false,
      meta: {},
      isDisabled: false
    };

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.clean = this.clean.bind(this);
  }

  UNSAFE_componentWillMount () {
    pm.mediator.on('showDeleteExampleModal', this.handleOpen);
  }

  componentDidUpdate (prevProps, prevState) {
    if (!prevState.isOpen && this.state.isOpen) {
      this.keymapRef && this.keymapRef.focus();
    }
  }

  componentWillUnmount () {
    pm.mediator.off('showDeleteExampleModal', this.handleClose);
  }

  async handleConfirm () {
    this.setState({ isDisabled: true });
    try {
      await this.callback(null, true);
      this.clean();
    } catch (err) {
      pm.logger.error('DeleteRequestModalContainer~handleConfirm', err);

      this.setState({ isDisabled: false });
    }
  }

  handleClose () {
    this.callback(null, false);
    this.clean();
  }

  clean () {
    this.callback = _.noop;
    this.setState({
      isOpen: false,
      meta: null,
      isDisabled: false
    });
  }

  handleOpen (info, callback) {
    this.setState({
      isOpen: true,
      meta: info
    }, () => {
      this.callback = callback;
    });
  }

  render () {
    return (
      <DeleteConfirmationModal
        isDisabled={this.state.isDisabled}
        preventFocusReset
        entity='EXAMPLE'
        isOpen={this.state.isOpen}
        primaryAction={this.state.isDisabled ? 'Deleting' : 'Delete'}
        keymapRef={(ref) => { this.keymapRef = ref; }}
        meta={this.state.meta}
        onConfirm={this.handleConfirm}
        onRequestClose={this.handleClose}
      />
    );
  }
}
