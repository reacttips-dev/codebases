import React, { Component } from 'react';
import { createEvent } from '@postman-app-monolith/renderer/js/modules/model-event';
import dispatchUserAction from '@postman-app-monolith/renderer/js/modules/pipelines/user-action';
import { getStore } from '@postman-app-monolith/renderer/js/stores/get-store';
import { TrackedState, bindTrackedStateToComponent } from '@postman-app-monolith/renderer/js/modules/tracked-state/TrackedState';
import util from '@postman-app-monolith/renderer/js/utils/util';
import AddHeaderPreset from '@@runtime-repl/header-preset/AddHeaderPreset';

export default class AddHeaderPresetContainer extends Component {
  constructor (props) {
    super(props);
    this.state = {
      name: '',
      nameError: false,
      showColumns: _.get(pm.settings.getSetting('dataEditorColumns'), 'headers')
    };

    this.trackedState = new TrackedState({
      values: []
    });

    bindTrackedStateToComponent(this.trackedState, this);

    this.handleValuesChange = this.handleValuesChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleColumnToggle = this.handleColumnToggle.bind(this);
  }

  handleClose () {
    this.props.onClose && this.props.onClose();
    this.clearState();
  }

  handleSubmit () {
    if (_.isEmpty(this.state.name.trim())) {
      this.setState({ nameError: true });

      return;
    }

    const currentUser = getStore('CurrentUserStore'),
      headerPresetData = {
        id: util.guid(),
        name: this.state.name,
        headers: this.trackedState.get('values'),
        owner: currentUser.id,
        workspace: getStore('ActiveWorkspaceSessionStore').workspace // @todo: get current workspace from SessionController
      },
      addHeaderPresetEvent = createEvent('create', 'headerpreset', headerPresetData);

    dispatchUserAction(addHeaderPresetEvent)
      .catch((e) => { pm.logger.error('Error in creating header preset', e); });

    this.handleClose();
  }

  clearState () {
    this.setState({
      name: '',
      nameError: false
    });

    this.trackedState.reset({
      values: []
    });
  }

  handleNameChange (name) {
    this.setState({
      name,
      nameError: false
    });
  }

  handleValuesChange (values, done) {
    this.trackedState.set({ values });
    _.isFunction(done) && done();
  }

  handleColumnToggle (columns) {
    this.setState({ showColumns: columns });
    pm.settings.setSetting('dataEditorColumns', {
      ...pm.settings.getSetting('dataEditorColumns'),
      headers: columns
    });
  }

  render () {
    const currentTrackedState = this.trackedState.get();

    return (
      <AddHeaderPreset
        name={this.state.name}
        values={currentTrackedState.values}
        nameError={this.state.nameError}
        presetNameInput={this.props.presetNameInput}
        onValuesChange={this.handleValuesChange}
        onNameChange={this.handleNameChange}
        onClose={this.handleClose}
        showColumns={this.state.showColumns}
        onColumnToggle={this.handleColumnToggle}
        onSubmit={this.handleSubmit}
      />
    );
  }
}
