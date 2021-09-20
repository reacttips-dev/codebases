import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
import SwitchConflictedVersionModal from './SwitchConflictedVersionModal';

@pureRender
export default class SwitchConflictedVersionModalContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isOpen: false,
      onSave: null,
      onSaveAs: null
    };

    this.handleOpen = this.handleOpen.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleSaveAs = this.handleSaveAs.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  UNSAFE_componentWillMount () {
    pm.mediator.on('showSwitchConflictedVersionModal', this.handleOpen);
  }

  componentWillUnmount () {
    pm.mediator.off('showSwitchConflictedVersionModal', this.handleOpen);
  }

  handleOpen (onSave, onSaveAs) {
    this.setState({
      isOpen: true,
      onSave: onSave,
      onSaveAs: onSaveAs
    });
  }

  handleClose () {
    this.setState({
      isOpen: false,
      onSave: null,
      onSaveAs: null
    });
  }

  handleSave () {
    this.state.onSave && _.isFunction(this.state.onSave) && this.state.onSave();
    this.handleClose();
  }

  handleSaveAs () {
    this.state.onSaveAs && _.isFunction(this.state.onSaveAs) && this.state.onSaveAs();
    this.handleClose();
  }

  render () {
    return (
      <SwitchConflictedVersionModal
        isOpen={this.state.isOpen}
        onClose={this.handleClose}
        onSave={this.handleSave}
        onSaveAs={this.handleSaveAs}
      />
    );
  }
}
