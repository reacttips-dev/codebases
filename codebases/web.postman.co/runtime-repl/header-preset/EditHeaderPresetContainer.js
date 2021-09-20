import React, { Component } from 'react';
import HeaderPresetController from '@@runtime-repl/header-preset/datastores/controllers/HeaderPresetController';
import { createEvent } from '@postman-app-monolith/renderer/js/modules/model-event';
import dispatchUserAction from '@postman-app-monolith/renderer/js/modules/pipelines/user-action';
import { TrackedState, bindTrackedStateToComponent } from '@postman-app-monolith/renderer/js/modules/tracked-state/TrackedState';
import EditHeaderPreset from '@@runtime-repl/header-preset/EditHeaderPreset';

export default class EditHeaderPresetContainer extends Component {
  constructor (props) {
    super(props);
    this.state = {
      id: '',
      name: '',
      nameError: false,
      showColumns: _.get(pm.settings.getSetting('dataEditorColumns'), 'headers')
    };

    this.trackedState = new TrackedState({
      values: []
    });

    bindTrackedStateToComponent(this.trackedState, this);

    this.handleModelChange = this.handleModelChange.bind(this);
    this.handleValuesChange = this.handleValuesChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleColumnToggle = this.handleColumnToggle.bind(this);
  }

  UNSAFE_componentWillMount () {
    this._headerPresetId = this.props.headerPresetId;
    this.handleModelChange();
  }

  componentWillUnmount () {
    this._headerPresetId = null;
  }

  handleClose () {
    this.clearState();
    this._headerPresetId = null;
    this.props.onClose && this.props.onClose();
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    this._headerPresetId = nextProps.headerPresetId;
    this.handleModelChange();
  }

  handleModelChange () {
    if (!this._headerPresetId) {
      return;
    }

    HeaderPresetController
      .get({ id: this._headerPresetId })
      .then((headerPreset) => {
        this.setState({
          id: headerPreset.id,
          name: headerPreset.name
        });

        this.trackedState.reset({ values: headerPreset.headers });
      });
  }

  handleSubmit () {
    if (_.isEmpty(this.state.name.trim())) {
      this.setState({ nameError: true });

      return;
    }

    const updateHeaderPresetEvent = createEvent('update', 'headerpreset', {
      id: this.state.id,
      name: this.state.name,
      headers: this.trackedState.get('values')
    });

    dispatchUserAction(updateHeaderPresetEvent);

    this.handleClose();
  }

  clearState () {
    this.setState({
      id: '',
      name: '',
      nameError: false
    });

    this.trackedState.reset({ values: [] });
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
      <EditHeaderPreset
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
        headerPresetId={this.props.headerPresetId}
      />
    );
  }
}
