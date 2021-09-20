import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { getStore } from '@postman-app-monolith/renderer/js/stores/get-store';
import HeaderPresetList from '@@runtime-repl/header-preset/HeaderPresetList';

@observer
export default class HeaderPresetListContainer extends Component {
  constructor (props) {
    super(props);

    this.handleSelect = this.handleSelect.bind(this);
    this.handleAction = this.handleAction.bind(this);
  }

  handleSelect (id) {
    this.props.onHeaderPresetSelect && this.props.onHeaderPresetSelect(id);
  }

  handleDelete (id) {
    pm.mediator.trigger('showHeaderPresetDeleteModal', id);
  }

  handleAction (id, action) {
    if (action === 'delete') {
      this.handleDelete(id);
    }
  }

  render () {
    return (
      <HeaderPresetList
        headerPresets={getStore('ActiveWorkspaceStore').headerPresets}
        onSelect={this.handleSelect}
        onAction={this.handleAction}
      />
    );
  }
}
