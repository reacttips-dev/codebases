'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { createRef, Component } from 'react';
import UITextInput from 'UIComponents/input/UITextInput';
import refObject from 'UIComponents/utils/propTypes/refObject';
import omit from 'transmute/omit';
import { formatDuration } from 'customer-data-objects/property/PropertyTypeFormatter';
var propTypes = {
  autoFocus: PropTypes.bool,
  inputRef: refObject,
  propertyIndex: PropTypes.number,
  value: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired])
};

var PropertyInputDuration = /*#__PURE__*/function (_Component) {
  _inherits(PropertyInputDuration, _Component);

  function PropertyInputDuration() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, PropertyInputDuration);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(PropertyInputDuration)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.inputRef = /*#__PURE__*/createRef();
    return _this;
  }

  _createClass(PropertyInputDuration, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.props.autoFocus) {
        this.focus();
      }
    }
  }, {
    key: "focus",
    value: function focus() {
      (this.props.inputRef || this.inputRef).current.focus();
    }
  }, {
    key: "getValue",
    value: function getValue() {
      var value = this.props.value;
      if (isNaN(value) || value === '' || value === null || value === undefined) return '';
      return formatDuration(value);
    }
  }, {
    key: "render",
    value: function render() {
      var transferableProps = omit(['baseUrl', 'isInline', 'objectType', 'onCancel', 'onInvalidProperty', 'property', 'propertyIndex', 'readOnlySourceData', 'resolver', 'showError', 'showPlaceholder', 'subjectId', 'secondaryChanges', 'onSecondaryChange', 'onTracking', 'isRequired'], this.props);
      return /*#__PURE__*/_jsx(UITextInput, Object.assign({}, transferableProps, {
        autoFocus: this.props.autoFocus,
        inputRef: this.props.inputRef || this.inputRef,
        value: this.getValue(),
        autoComplete: "off",
        readOnly: true
      }));
    }
  }]);

  return PropertyInputDuration;
}(Component);

export { PropertyInputDuration as default };
PropertyInputDuration.propTypes = propTypes;
PropertyInputDuration.defaultProps = UITextInput.defaultProps;