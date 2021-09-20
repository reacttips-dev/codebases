import React, { Component } from 'react';
import { Input } from '../base/Inputs';

export default class SettingsValueInput extends Component {
  constructor (props) {
    super(props);
    this.handleValueChange = this.handleValueChange.bind(this);
  }
  handleValueChange (value) {
    this.props.onValueChange && this.props.onValueChange(value);
  }

  render () {

    let value = this.props.value,
      placeholder = this.props.placeholder;
    return (
      <Input
        inputStyle='box'
        type={this.props.type}
        value={value}
        minVal={this.props.type === 'number' && this.props.minVal}
        maxVal={this.props.type === 'number' && this.props.maxVal}
        disabled={this.props.disabled}
        placeholder={placeholder}
        onChange={this.handleValueChange}
      />
    );
  }
}

SettingsValueInput.defaultProps = {
  type: 'text'
};
