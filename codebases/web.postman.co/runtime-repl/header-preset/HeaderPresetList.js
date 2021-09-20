import React, { Component } from 'react';
import { observer } from 'mobx-react';
import HeaderPresetListItem from './HeaderPresetListItem';

@observer
export default class HeaderPresetList extends Component {
  handleSelect (id) {
    this.props.onSelect && this.props.onSelect(id);
  }

  handleAction (id, action) {
    this.props.onAction && this.props.onAction(id, action);
  }

  render () {
    return (
      <div className='header-preset-list'>
        {
        this.props.headerPresets.map((headerPreset) => (
          <HeaderPresetListItem
            headerPreset={headerPreset}
            key={headerPreset.id}
            onSelect={this.handleSelect.bind(this, headerPreset.id)}
            onAction={this.handleAction.bind(this, headerPreset.id)}
          />
        ))
      }
      </div>
    );
  }
}
