import React from 'react';
import PropTypes from 'prop-types';
import TextInput from '../text';
import {debounce} from '../../../utils/debounce';

export default class DebouncedInput extends TextInput {
  static propTypes = {
    wait: PropTypes.number
  };

  static defaultProps = {
    wait: 300
  };

  doChange = debounce(this.props.onChange, this.props.wait);

  handleChange = event => this.doChange(event.target.value);

  render() {
    return <TextInput {...this.props} onChange={this.handleChange} />;
  }
}
