'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { createRef, Component } from 'react';
import UIPercentageInput from 'UIComponents/input/UIPercentageInput';
import omit from 'transmute/omit';
import SyntheticEvent from 'UIComponents/core/SyntheticEvent';
import refObject from 'UIComponents/utils/propTypes/refObject';
import identity from 'transmute/identity';
var propTypes = {
  autoFocus: PropTypes.bool,
  inputRef: refObject,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired])
};

var PropertyInputPercentage = /*#__PURE__*/function (_Component) {
  _inherits(PropertyInputPercentage, _Component);

  function PropertyInputPercentage() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, PropertyInputPercentage);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(PropertyInputPercentage)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.inputRef = /*#__PURE__*/createRef();

    _this.onChangePercentage = function (_ref) {
      var value = _ref.target.value;
      var onChange = _this.props.onChange;
      onChange(SyntheticEvent(Number(value) / 100));
    };

    return _this;
  }

  _createClass(PropertyInputPercentage, [{
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
    value: function getValue(value) {
      if (value == null || isNaN(value)) {
        return 0;
      }

      return value * 100;
    }
  }, {
    key: "render",
    value: function render() {
      var transferableProps = omit(['actions', 'baseUrl', 'caretRenderer', 'isInline', 'multiCurrencyCurrencyCode', 'objectType', 'onCancel', 'onInvalidProperty', 'onPipelineChange', 'property', 'propertyIndex', 'readOnlySourceData', 'resolver', 'showError', 'showPlaceholder', 'subjectId', 'secondaryChanges', 'onSecondaryChange', 'wrappers', 'onTracking', 'isRequired'], this.props);
      return /*#__PURE__*/_jsx(UIPercentageInput, Object.assign({}, transferableProps, {
        onChange: this.props.onChange ? this.onChangePercentage : identity,
        inputRef: this.props.inputRef || this.inputRef,
        value: this.getValue(this.props.value),
        min: 0,
        max: 100,
        precision: 2
      }));
    }
  }]);

  return PropertyInputPercentage;
}(Component);

export { PropertyInputPercentage as default };
PropertyInputPercentage.propTypes = propTypes;
PropertyInputPercentage.defaultProps = UIPercentageInput.defaultProps;