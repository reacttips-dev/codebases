'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import FilterOperatorErrorType from 'customer-data-filters/components/propTypes/FilterOperatorErrorType';
import PropTypes from 'prop-types';
import { Component } from 'react';
import SyntheticEvent from 'UIComponents/core/SyntheticEvent';
import UIFormControl from 'UIComponents/form/UIFormControl';
import UINumberInput from 'UIComponents/input/UINumberInput';

var FilterOperatorPercentageInput = /*#__PURE__*/function (_Component) {
  _inherits(FilterOperatorPercentageInput, _Component);

  function FilterOperatorPercentageInput() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, FilterOperatorPercentageInput);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(FilterOperatorPercentageInput)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.handleRenderedValueChange = function (_ref) {
      var value = _ref.target.value;
      var onChange = _this.props.onChange;
      onChange(SyntheticEvent(value / 100));
    };

    return _this;
  }

  _createClass(FilterOperatorPercentageInput, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          className = _this$props.className,
          error = _this$props.error,
          value = _this$props.value,
          rest = _objectWithoutProperties(_this$props, ["className", "error", "value"]);

      var isError = error.get('error');
      var errorMessage = error.get('message');
      var renderedValue = value ? value * 100 : value;
      return /*#__PURE__*/_jsx(UIFormControl, {
        error: isError,
        validationMessage: isError ? errorMessage : null,
        children: /*#__PURE__*/_jsx(UINumberInput, Object.assign({}, rest, {
          className: className,
          formatStyle: "percentage",
          onChange: this.handleRenderedValueChange,
          value: renderedValue
        }))
      });
    }
  }]);

  return FilterOperatorPercentageInput;
}(Component);

export { FilterOperatorPercentageInput as default };
FilterOperatorPercentageInput.propTypes = {
  className: PropTypes.string,
  error: FilterOperatorErrorType.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.number
};