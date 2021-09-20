import React, { Component } from 'react';
import PropTypes from 'prop-types';
// TODO: the perfomance of lodash omit is known to be terrible.
// this component is rarely used, but mimics ureact-components' usage of omit
// when we move to veritas components, we should drop the use of omit and write
// our own impl or use lodash pick to specify the attributes we need.
import _omit from 'lodash/omit';
import { Tooltip } from '@udacity/veritas-components';
import styles from './select-menu.module.scss';

export default class Select extends Component {
  static propTypes = {
    options: PropTypes.object.isRequired,
    error: PropTypes.string,
    info: PropTypes.string,
    tooltipPlacement: PropTypes.oneOf(['start', 'top', 'end', 'bottom']),
    isFocus: PropTypes.bool,
    placeholder: PropTypes.string,
    onChange: PropTypes.func
  };

  static defaultProps = {
    error: null,
    info: null,
    isFocus: false
  };

  state = {
    selectedValue: ''
  };

  getRef() {
    return this.refs.select;
  }

  getValue() {
    return this.getRef().value;
  }

  handleChange = (event) => {
    this.props.onChange();
    this.setState({ selectedValue: event.target.value });
  };

  _renderSelect() {
    const { error, options, placeholder } = this.props;
    return (
      <select
        {..._omit(this.props, [
          'error',
          'info',
          'tooltipPlacement',
          'isFocus',
          'styles'
        ])}
        value={this.state.selectedValue}
        onChange={this.handleChange}
        ref="select"
        className={`${styles[error ? 'select-error' : 'select']} ${
          this.props.className
        }`}
        required
        aria-label={placeholder}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {[...options].map(([key, value]) => {
          return (
            <option key={key} value={key}>
              {value}
            </option>
          );
        })}
      </select>
    );
  }

  render() {
    const { error, info, tooltipPlacement } = this.props;
    if (error || info) {
      return (
        <Tooltip
          inverse
          direction={tooltipPlacement || 'end'}
          content={error || info}
          trigger={this._renderSelect()}
        />
      );
    } else {
      return this._renderSelect();
    }
  }
}
