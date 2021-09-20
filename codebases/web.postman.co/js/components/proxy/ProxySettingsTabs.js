import React, { Component } from 'react';
import { Tabs, Tab } from '../base/Tabs';

export default class ProxySettingsTabs extends Component {
  constructor (props) {
    super(props);
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect (id) {
    this.props.onSelect && this.props.onSelect(id);
  }

  render () {

    return (
      <div className='capture-modal-title modal proxy-modal'>
      <Tabs
        type='primary'
        defaultActive='Connection'
        activeRef={this.props.activeTab}
        onChange={this.handleSelect}
        className='tabs tabs-primary capture-settings-tabs'
      >
        <Tab refKey='Connection'>Requests</Tab>
        <Tab refKey='Cookies'>Cookies</Tab>
      </Tabs>
      </div>
    );
  }
}
