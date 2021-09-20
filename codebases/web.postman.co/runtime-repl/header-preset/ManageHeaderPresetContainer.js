import React, { Component } from 'react';
import classnames from 'classnames';

import ManageHeaderPresetControls from '@@runtime-repl/header-preset/ManageHeaderPresetControls';
import HeaderPresetListContainer from './HeaderPresetListContainer';
import AddHeaderPresetContainer from './AddHeaderPresetContainer';
import EditHeaderPresetContainer from './EditHeaderPresetContainer';

const MANAGE_HEADER_PRESET_VIEW_MAIN = 'main',
  MANAGE_HEADER_PRESET_VIEW_ADD_ENV = 'add-environment',
  MANAGE_HEADER_PRESET_VIEW_EDIT_ENV = 'edit-environment';

export default class ManageHeaderPresetContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      currentView: MANAGE_HEADER_PRESET_VIEW_MAIN,
      headerPresetId: ''
    };

    this.isDirty = this.isDirty.bind(this);
    this.handleHeaderPresetSelect = this.handleHeaderPresetSelect.bind(this);
  }

  handleViewChange (view) {
    this.setState({
      currentView: view,
      headerPresetId: ''
    }, () => {
      if (view === MANAGE_HEADER_PRESET_VIEW_ADD_ENV) {
        this.addPresetNameInput && this.addPresetNameInput.focus();
      }
    });
  }

  handleHeaderPresetSelect (id) {
    this.setState({
      currentView: MANAGE_HEADER_PRESET_VIEW_EDIT_ENV,
      headerPresetId: id
    }, () => {
      this.editPresetNameInput && this.editPresetNameInput.focus();
    });
  }

  getClasses (view) {
    return classnames({
      'manage-header-preset-wrapper': true,
      'is-hidden': this.state.currentView !== view,
      'manage-header-preset-wrapper--main': view === MANAGE_HEADER_PRESET_VIEW_MAIN,
      'manage-header-preset-wrapper--add-env': view === MANAGE_HEADER_PRESET_VIEW_ADD_ENV,
      'manage-header-preset-wrapper--edit-env': view === MANAGE_HEADER_PRESET_VIEW_EDIT_ENV
    });
  }

  isDirty () {
    if (this.state.currentView === MANAGE_HEADER_PRESET_VIEW_ADD_ENV && this.refs.addHeaderPresetContainer) {
      return this.refs.addHeaderPresetContainer.trackedState.isDirty();
    }

    if (this.state.currentView === MANAGE_HEADER_PRESET_VIEW_EDIT_ENV && this.refs.editHeaderPresetContainer) {
      return this.refs.editHeaderPresetContainer.trackedState.isDirty();
    }

    return false;
  }

  render () {
    return (
      <div className='manage-header-preset-container'>
        <div className={this.getClasses(MANAGE_HEADER_PRESET_VIEW_MAIN)}>
          <ManageHeaderPresetControls
            onAddHeaderPresetSelect={this.handleViewChange.bind(this, MANAGE_HEADER_PRESET_VIEW_ADD_ENV)}
          />
          <HeaderPresetListContainer
            onHeaderPresetSelect={this.handleHeaderPresetSelect}
          />
        </div>
        <div className={this.getClasses(MANAGE_HEADER_PRESET_VIEW_ADD_ENV)}>
          <AddHeaderPresetContainer
            ref='addHeaderPresetContainer'
            presetNameInput={(input) => { this.addPresetNameInput = input; }}
            onClose={this.handleViewChange.bind(this, MANAGE_HEADER_PRESET_VIEW_MAIN)}
          />
        </div>
        <div className={this.getClasses(MANAGE_HEADER_PRESET_VIEW_EDIT_ENV)}>
          {
          this.state.currentView === MANAGE_HEADER_PRESET_VIEW_EDIT_ENV && (
            <EditHeaderPresetContainer
              ref='editHeaderPresetContainer'
              headerPresetId={this.state.headerPresetId}
              presetNameInput={(input) => { this.editPresetNameInput = input; }}
              onClose={this.handleViewChange.bind(this, MANAGE_HEADER_PRESET_VIEW_MAIN)}
            />
          )
}
        </div>
      </div>
    );
  }
}
