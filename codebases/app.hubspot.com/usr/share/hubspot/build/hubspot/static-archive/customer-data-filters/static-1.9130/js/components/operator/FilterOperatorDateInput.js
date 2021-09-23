'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { DATE, DATE_TIME } from 'customer-data-objects/property/PropertyTypes';
import { fromMoment, toMoment, toMomentUTC } from 'UIComponents/core/SimpleDate';
import FilterOperatorErrorType from 'customer-data-filters/components/propTypes/FilterOperatorErrorType';
import I18n from 'I18n';
import PropTypes from 'prop-types';
import { Component } from 'react';
import SyntheticEvent from 'UIComponents/core/SyntheticEvent';
import UIDateInput from 'UIComponents/dates/UIDateInput';
import UIFormControl from 'UIComponents/form/UIFormControl';
import { getTransferableProps } from './filterInputProps';
var dateFormat = 'Y-MM-DD';

function toSimpleDate(fieldType, dateString) {
  if (!dateString) {
    return null;
  }

  if (fieldType === DATE_TIME) {
    return fromMoment(I18n.moment.utc(dateString));
  }

  return fromMoment(I18n.moment.portalTz(dateString));
}

function fromSimpleDate(fieldType, simpleDate) {
  if (simpleDate == null) return null;
  var moment = fieldType === DATE_TIME ? toMomentUTC(simpleDate) : toMoment(simpleDate);
  return moment.format(dateFormat);
}

var FilterOperatorDateInput = /*#__PURE__*/function (_Component) {
  _inherits(FilterOperatorDateInput, _Component);

  function FilterOperatorDateInput() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, FilterOperatorDateInput);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(FilterOperatorDateInput)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.handleChange = function (evt) {
      var _this$props = _this.props,
          onChange = _this$props.onChange,
          fieldType = _this$props.fieldType;
      onChange(SyntheticEvent(fromSimpleDate(fieldType, evt.target.value)));
    };

    return _this;
  }

  _createClass(FilterOperatorDateInput, [{
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          className = _this$props2.className,
          error = _this$props2.error,
          fieldType = _this$props2.fieldType,
          value = _this$props2.value,
          rest = _objectWithoutProperties(_this$props2, ["className", "error", "fieldType", "value"]);

      var isError = error.get('error');
      var errorMessage = error.get('message');
      return /*#__PURE__*/_jsx(UIFormControl, {
        "aria-label": I18n.text('customerDataFilters.FilterOperatorInput.ariaLabel'),
        error: isError,
        validationMessage: isError ? errorMessage : null,
        children: /*#__PURE__*/_jsx(UIDateInput, Object.assign({}, getTransferableProps(rest), {
          className: className,
          onChange: this.handleChange,
          value: toSimpleDate(fieldType, value)
        }))
      });
    }
  }]);

  return FilterOperatorDateInput;
}(Component);

export { FilterOperatorDateInput as default };
FilterOperatorDateInput.propTypes = {
  className: PropTypes.string,
  error: FilterOperatorErrorType.isRequired,
  fieldType: PropTypes.oneOf([DATE, DATE_TIME]).isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string
};