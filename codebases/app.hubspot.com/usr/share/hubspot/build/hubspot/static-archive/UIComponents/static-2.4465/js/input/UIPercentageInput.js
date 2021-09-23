'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { Component } from 'react';
import omit from '../utils/underscore/omit';
import UINumberInput from './UINumberInput';

var UIPercentageInput = /*#__PURE__*/function (_Component) {
  _inherits(UIPercentageInput, _Component);

  function UIPercentageInput() {
    _classCallCheck(this, UIPercentageInput);

    return _possibleConstructorReturn(this, _getPrototypeOf(UIPercentageInput).apply(this, arguments));
  }

  _createClass(UIPercentageInput, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/_jsx(UINumberInput, Object.assign({}, this.props, {
        formatStyle: "percentage"
      }));
    }
  }]);

  return UIPercentageInput;
}(Component);

UIPercentageInput.displayName = 'UIPercentageInput';
UIPercentageInput.propTypes = Object.assign({}, omit(UINumberInput.propTypes, ['formatStyle', 'currency']));
UIPercentageInput.defaultProps = Object.assign({}, UINumberInput.defaultProps);
export default UIPercentageInput;