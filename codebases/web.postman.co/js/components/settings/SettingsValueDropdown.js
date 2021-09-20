import React, { Component } from 'react';
import { Dropdown, DropdownButton, DropdownMenu, MenuItem } from '../base/Dropdowns';
import { Button } from '../base/Buttons';

export default class SettingsValueDropdown extends Component {
  constructor (props) {
    super(props);
    this.handleValueSelect = this.handleValueSelect.bind(this);
  }
  handleValueSelect (value) {
    this.props.onValueChange && this.props.onValueChange(value);
  }

  render () {

    return (
      <Dropdown
        onSelect={this.handleValueSelect}
      >
        <DropdownButton>
          <Button><span>{ this.props.value }</span></Button>
        </DropdownButton>
        <DropdownMenu fluid>
          {
            this.props.options.map((option, index) => {
              return <MenuItem refKey={option} key={option} align-center><span>{this.props.labels[index]}</span></MenuItem>;
            })
          }
        </DropdownMenu>
      </Dropdown>
    );
  }
}
