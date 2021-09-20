import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
import SyncTokenConfirmationModal from './SyncTokenConfirmationModal';

@pureRender
export default class SyncTokenConfirmationContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isOpen: false,
      options: {}
    };

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
  }

  UNSAFE_componentWillMount () {
    pm.mediator.on('showSyncTokenConfirmation', this.handleOpen);
  }

  componentWillUnmount () {
    pm.mediator.off('showSyncTokenConfirmation', this.handleOpen);
  }

  handleOpen (options = {}, callback) {
    this.callback = callback;
    this.setState({
      isOpen: true,
      options
    }, () => {
      _.invoke(this, 'keymapRef.focus');
    });
  }

  handleClose () {
    this.callback = null;
    this.setState({
      isOpen: false,
      options: {}
    });
  }

  handleConfirm () {
    this.callback && this.callback();
    this.handleClose();
  }

  render () {
    return (
      <SyncTokenConfirmationModal
        isOpen={this.state.isOpen}
        onConfirm={this.handleConfirm}
        onRequestClose={this.handleClose}
        options={this.state.options}
        callback={this.callback}
        keymapRef={(ref) => { this.keymapRef = ref; }}
      />
    );
  }
}
