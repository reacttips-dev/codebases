'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { Seq } from 'immutable';
import { isFormattedNumber } from 'customer-data-objects/property/PropertyIdentifier';
import PropertyRecord from 'customer-data-objects/property/PropertyRecord';
import PropTypes from 'prop-types';
import { createRef, Component } from 'react';
import SyntheticEvent from 'UIComponents/core/SyntheticEvent';
import UINumberInput from 'UIComponents/input/UINumberInput';
import UITextInput from 'UIComponents/input/UITextInput';
import refObject from 'UIComponents/utils/propTypes/refObject';
import emptyFunction from 'react-utils/emptyFunction';
import omit from 'transmute/omit';
var defaultProps = {
  onChange: emptyFunction,
  precision: 5
};
var propTypes = {
  inputRef: refObject,
  multiCurrencyCurrencyCode: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  property: PropTypes.instanceOf(PropertyRecord).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  precision: PropTypes.number
};

var PropertyInputNumber = /*#__PURE__*/function (_Component) {
  _inherits(PropertyInputNumber, _Component);

  function PropertyInputNumber() {
    var _this;

    _classCallCheck(this, PropertyInputNumber);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PropertyInputNumber).call(this));

    _this.handleChange = function (evt) {
      var _evt$target = evt.target;
      _evt$target = _evt$target === void 0 ? {} : _evt$target;
      var nextValue = _evt$target.value;
      var _this$props = _this.props,
          onChange = _this$props.onChange,
          property = _this$props.property,
          value = _this$props.value;

      if (nextValue !== value) {
        var isUnformattedNumericPropertyType = (typeof nextValue === 'number' || !isFormattedNumber(property)) && !isNaN(nextValue);
        var nextEvent = isUnformattedNumericPropertyType || !nextValue || typeof nextValue.replace !== 'function' ? evt : SyntheticEvent(nextValue.replace(/\D/g, ''));
        onChange(nextEvent);
      }
    };

    _this.inputRef = /*#__PURE__*/createRef();
    return _this;
  }

  _createClass(PropertyInputNumber, [{
    key: "focus",
    value: function focus() {
      (this.props.inputRef || this.inputRef).current.focus();
      (this.props.inputRef || this.inputRef).current.select();
    }
  }, {
    key: "parseValue",
    value: function parseValue(value) {
      if (!value && value !== 0) {
        return undefined;
      }

      var parsedValue = parseFloat(value);

      if (isNaN(parsedValue)) {
        return undefined;
      }

      return parsedValue;
    }
  }, {
    key: "render",
    value: function render() {
      var property = this.props.property;
      var transferableProps = omit(['baseUrl', 'caretRenderer', 'isInline', 'objectType', 'onCancel', 'onInvalidProperty', 'onPipelineChange', 'property', 'propertyIndex', 'readOnlySourceData', 'resolver', 'resolvers', 'showError', 'showPlaceholder', 'subjectId', 'secondaryChanges', 'onSecondaryChange', 'wrappers', 'onTracking', 'isRequired'], Seq(this.props)).toJS();

      if (isFormattedNumber(property)) {
        return /*#__PURE__*/_jsx(UINumberInput, Object.assign({}, transferableProps, {
          value: this.parseValue(this.props.value),
          onChange: this.handleChange,
          inputRef: this.props.inputRef || this.inputRef
        }));
      }

      return /*#__PURE__*/_jsx(UITextInput, Object.assign({}, transferableProps, {
        onChange: this.handleChange,
        inputRef: this.props.inputRef || this.inputRef
      }));
    }
  }]);

  return PropertyInputNumber;
}(Component);

export { PropertyInputNumber as default };
PropertyInputNumber.propTypes = propTypes;
PropertyInputNumber.defaultProps = defaultProps;