import $ from 'jquery';

/**
 * React component wrapper for selectize.js
 */

/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';

import React from 'react';
import selectize from 'selectize';
import 'css!bundles/vendor/selectize/styles/selectize.css'; // eslint-disable-line no-restricted-syntax
import 'css!bundles/vendor/selectize/styles/selectize.bootstrap3.css'; // eslint-disable-line no-restricted-syntax

// TODO: Get rid of this component and use react-selectize: https://github.com/furqanZafar/react-selectize
class SelectizeComponent extends React.Component {
  static propTypes = {
    options: PropTypes.object.isRequired,
    placeholder: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    focus: PropTypes.bool,
    clearInput: PropTypes.bool,
  };

  componentDidMount() {
    const { disabled, focus, options } = this.props;

    const { select } = this;
    const selectizeElement = $(select).selectize(options);

    this.selectizeInstance = selectizeElement[0].selectize;

    if (disabled) {
      selectizeElement[0].selectize.disable();
    }

    if (options.selected) {
      // Silently change value to selected
      selectizeElement[0].selectize.setValue(options.selected, true);
    }

    if (focus) {
      this.selectizeInstance.focus();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { options, disabled, clearInput } = this.props;
    // eslint-disable-next-line
    const select = this.select;
    const selectizeElement = $(select).selectize(options);

    if (nextProps.disabled !== disabled) {
      if (nextProps.disabled) {
        selectizeElement[0].selectize.disable();
      } else {
        selectizeElement[0].selectize.enable();
      }

      return true;
    }

    if (nextProps.clearInput !== clearInput) {
      if (nextProps.clearInput) {
        selectizeElement[0].selectize.clear(true);
      }

      return true;
    }

    if (nextProps.options.selected && nextProps.options.selected !== options.selected) {
      selectizeElement[0].selectize.setValue(nextProps.options.selected, true);
    }

    return false;
  }

  render() {
    return (
      <div className="rc-Selectize">
        <select
          ref={(select) => {
            this.select = select;
          }}
          placeholder={this.props.placeholder}
        />
      </div>
    );
  }
}

export default SelectizeComponent;
