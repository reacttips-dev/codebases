import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
import DeleteConfirmationModal from '@postman-app-monolith/renderer/js/components/collections/DeleteConfirmationModal';

@pureRender
export default class DeleteFolderModalContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isOpen: false,
      meta: null,
      isDisabled: false
    };

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.clean = this.clean.bind(this);
  }

  UNSAFE_componentWillMount () {
    pm.mediator.on('showDeleteFolderModal', this.handleOpen);
  }

  componentWillUnmount () {
    pm.mediator.off('showDeleteFolderModal', this.handleOpen);
  }

  handleOpen (folderUid, { name }, callback) {
    this.callback = callback;
    this.setState({
      isOpen: true,
      meta: { name }
    }, () => {
      _.invoke(this, 'keymapRef.focus');
    });
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

  async handleConfirm () {
    this.setState({ isDisabled: true });
    try {
      await this.callback(null, true);
      this.clean();
    } catch (err) {
      pm.logger.error('DeleteFolderModalContainer~handleConfirm', err);

      this.setState({ isDisabled: false });
    }
  }

  render () {
    return (
      <DeleteConfirmationModal
        preventFocusReset
        isDisabled={this.state.isDisabled}
        primaryAction={this.state.isDisabled ? 'Deleting' : 'Delete'}
        isOpen={this.state.isOpen}
        entity='FOLDER'
        keymapRef={(ref) => { this.keymapRef = ref; }}
        meta={this.state.meta}
        onConfirm={this.handleConfirm}
        onRequestClose={this.handleClose}
      />
    );
  }
}
