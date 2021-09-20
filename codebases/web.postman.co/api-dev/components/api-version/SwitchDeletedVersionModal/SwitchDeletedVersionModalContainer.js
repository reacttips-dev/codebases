import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
import SwitchDeletedVersionModal from './SwitchDeletedVersionModal';

@pureRender
export default class SwitchDeletedVersionModalContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isOpen: false,
      onSave: null,
      onDiscard: null
    };

    this.handleOpen = this.handleOpen.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleDiscard = this.handleDiscard.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  UNSAFE_componentWillMount () {
    pm.mediator.on('showSwitchDeletedVersionModal', this.handleOpen);
  }

  componentWillUnmount () {
    pm.mediator.off('showSwitchDeletedVersionModal', this.handleOpen);
  }

  handleOpen (onSave, onDiscard) {
    this.setState({
      isOpen: true,
      onSave: onSave,
      onDiscard: onDiscard
    });
  }

  handleClose () {
    this.setState({
      isOpen: false,
      onSave: null,
      onDiscard: null
    });
  }

  handleSave () {
    this.state.onSave && _.isFunction(this.state.onSave) && this.state.onSave();
    this.handleClose();
  }

  handleDiscard () {
    this.state.onDiscard && _.isFunction(this.state.onDiscard) && this.state.onDiscard();
    this.handleClose();
  }

  render () {
    return (
      <SwitchDeletedVersionModal
        isOpen={this.state.isOpen}
        onClose={this.handleClose}
        onSave={this.handleSave}
        onDiscard={this.handleDiscard}
      />
    );
  }
}
