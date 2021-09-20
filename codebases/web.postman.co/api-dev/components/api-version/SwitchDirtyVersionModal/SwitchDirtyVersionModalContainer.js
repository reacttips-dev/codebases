import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
import SwitchDirtyVersionModal from './SwitchDirtyVersionModal';

@pureRender
export default class SwitchDirtyVersionModalContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isOpen: false,
      onSave: null,
      onDiscard: null,
      entityToSwitch: null
    };

    this.handleOpen = this.handleOpen.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleDiscard = this.handleDiscard.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  UNSAFE_componentWillMount () {
    pm.mediator.on('showSwitchDirtyVersionModal', this.handleOpen);
  }

  componentWillUnmount () {
    pm.mediator.off('showSwitchDirtyVersionModal', this.handleOpen);
  }

  /**
   * Handles the opening of save schema modal when schema has unsaved changes,
   * used either when switching version or build mode to comment mode
   * @param {Function} onSave Method to invoke when user selects to save the schema
   * @param {Function} onDiscard Method to invoke when changes are discarded
   * @param {String} entityToSwitch The entity being switched, possible values are either version or mode,
   * defaults to version
   */
  handleOpen (onSave, onDiscard, entityToSwitch) {
    this.setState({
      isOpen: true,
      onSave: onSave,
      onDiscard: onDiscard,
      entityToSwitch: entityToSwitch || 'version'
    });
  }

  handleClose () {
    this.setState({
      isOpen: false,
      onSave: null,
      onDiscard: null,
      entityToSwitch: null
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
      <SwitchDirtyVersionModal
        isOpen={this.state.isOpen}
        onClose={this.handleClose}
        onSave={this.handleSave}
        onDiscard={this.handleDiscard}
        entityToSwitch={this.state.entityToSwitch}
      />
    );
  }
}
