import React, { Component } from 'react';
import { getStore } from '../../../../stores/get-store';
import { observer } from 'mobx-react';
import XPath from '../../../../components/base/XPaths/XPath';
import { Input } from '../../../../components/base/Inputs';

@observer
export default class SidebarFilter extends Component {
  constructor (props) {
    super(props);

    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleSearchCancel = this.handleSearchCancel.bind(this);
    this.focusSearchBox = this.focusSearchBox.bind(this);
  }

  UNSAFE_componentWillMount () {
    pm.mediator.on('focusSearchBox', this.focusSearchBox);
  }

  componentWillUnmount () {
    pm.mediator.off('focusSearchBox', this.focusSearchBox);
  }

  focusSearchBox () {
    _.invoke(this, 'refs.filter.focus');
  }

  handleSearchChange (query) {
    this.props.onSearch && this.props.onSearch(query);
  }

  handleSearchCancel () {
    this.props.onSearch && this.props.onSearch('');
  }

  render () {
    return (
      <XPath identifier='filter'>
          <Input
            icon='icon-action-filter-stroke'
            ref='filter'
            inputStyle='search'
            onChange={this.handleSearchChange}
            onCancel={this.handleSearchCancel}
            query={this.props.searchQuery}
            className={this.props.className}
          />
        </XPath>
    );
  }
}
