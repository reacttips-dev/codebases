import React, { Component } from 'react';
import EditorService from '../../services/EditorService';
import DeleteConfirmationModal from '../collections/DeleteConfirmationModal';
import { getStore } from '../../stores/get-store';

export default class ForceCloseAllTabsConfirmation extends Component {
  constructor (props) {
    super(props);

    this.state = { isOpen: false };

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
  }

  UNSAFE_componentWillMount () {
    pm.mediator.on('showForceCloseConfirmationModal', this.handleOpen);
  }

  componentWillUnmount () {
    pm.mediator.off('showForceCloseConfirmationModal', this.handleOpen);
  }

  handleOpen () {

    this.setState({ isOpen: true });
  }

  handleClose () {
    this.setState({ isOpen: false });
  }

  handleConfirm () {
    EditorService.confirmForceCloseAll();
    this.handleClose();
  }

  render () {
    let dirtyEditorsCount = getStore('EditorStore').dirtyEditorsCount;

    return (
      <DeleteConfirmationModal
        preventFocusReset
        entity='TAB'
        isOpen={this.state.isOpen}
        keymapRef={(ref) => { this.keymapRef = ref; }}
        meta={{ count: dirtyEditorsCount }}
        primaryAction='Force Close'
        onConfirm={this.handleConfirm}
        onRequestClose={this.handleClose}
      />
    );
  }
}
