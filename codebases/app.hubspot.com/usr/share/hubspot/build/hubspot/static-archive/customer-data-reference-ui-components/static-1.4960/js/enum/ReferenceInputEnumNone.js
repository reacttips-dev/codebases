'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { OptionType } from 'UIComponents/types/OptionTypes';
import PropTypes from 'prop-types';
import { Component } from 'react';
import UISelect from 'UIComponents/input/UISelect';
var propTypes = {
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(OptionType.isRequired),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string.isRequired)])
};
var defaultProps = {
  options: []
};

var ReferenceInputEnumNone = /*#__PURE__*/function (_Component) {
  _inherits(ReferenceInputEnumNone, _Component);

  function ReferenceInputEnumNone() {
    _classCallCheck(this, ReferenceInputEnumNone);

    return _possibleConstructorReturn(this, _getPrototypeOf(ReferenceInputEnumNone).apply(this, arguments));
  }

  _createClass(ReferenceInputEnumNone, [{
    key: "focus",
    value: function focus() {
      this.refs.input.focus();
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          options = _this$props.options,
          rest = _objectWithoutProperties(_this$props, ["options"]);

      return /*#__PURE__*/_jsx(UISelect, Object.assign({}, rest, {
        options: options,
        ref: "input"
      }));
    }
  }]);

  return ReferenceInputEnumNone;
}(Component);

export { ReferenceInputEnumNone as default };
ReferenceInputEnumNone.propTypes = propTypes;
ReferenceInputEnumNone.defaultProps = defaultProps;