import React, { Component } from 'react';
import { Dropdown, DropdownMenu, MenuItem, DropdownButton } from '../../base/Dropdowns';
import classnames from 'classnames';

export default class Drawer extends Component {
  constructor (props) {
    super(props);

    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect (item) {
    this.props.onSelect && this.props.onSelect(item);
  }

  getClasses () {
    return classnames({ 'sb__drawer': true }, this.props.className);
  }

  getItemProps (defaultArgs, props = {}) {
    return {
      ...defaultArgs,
      ...props,
      className: classnames(defaultArgs.className, props.className || '')
    };
  }

  render () {
    return (
      <div className={this.getClasses()}>
        <Dropdown onSelect={this.handleSelect}>
          <DropdownButton>
            { this.props.button && this.props.button() }
          </DropdownButton>
          <DropdownMenu className='help-plugin-dropdown-menu' align-right>
            {
              _.map(this.props.items, (item) => {
                return (
                  <MenuItem
                    key={item.key}
                    refKey={item.key}
                  >
                    <span>{ item.label }</span>
                  </MenuItem>
                );
              })
            }
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  }
}

Drawer.defaultProps = {
  itemRenderer: (item, getItemProps) => {
    return (
      <div {...getItemProps()}>
        {item.label}
      </div>
    );
  }
};
