'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { UNFORMATTED } from 'customer-data-objects/property/NumberDisplayHint';
import FilterOperatorErrorType from 'customer-data-filters/components/propTypes/FilterOperatorErrorType';
import PropTypes from 'prop-types';
import UICurrencyInput from 'UIComponents/input/UICurrencyInput';
import UIFormControl from 'UIComponents/form/UIFormControl';
import UINumberInput from 'UIComponents/input/UINumberInput';
import isNumber from 'transmute/isNumber';
import I18n from 'I18n';
import { getTransferableProps } from './filterInputProps';
export var unformattedNumberFormatter = function unformattedNumberFormatter(number) {
  return isNumber(number) ? "" + number : '';
};

var FilterOperatorNumberInput = function FilterOperatorNumberInput(props) {
  var className = props.className,
      currencyCode = props.currencyCode,
      error = props.error,
      numberDisplayHint = props.numberDisplayHint,
      onChange = props.onChange,
      showCurrencySymbol = props.showCurrencySymbol,
      value = props.value,
      rest = _objectWithoutProperties(props, ["className", "currencyCode", "error", "numberDisplayHint", "onChange", "showCurrencySymbol", "value"]);

  var isError = error.get('error');
  var errorMessage = error.get('message');
  var Input = showCurrencySymbol ? UICurrencyInput : UINumberInput;
  var formatter = numberDisplayHint === UNFORMATTED ? unformattedNumberFormatter : undefined;
  return /*#__PURE__*/_jsx(UIFormControl, {
    "aria-label": I18n.text('customerDataFilters.FilterOperatorInput.ariaLabel'),
    error: isError,
    validationMessage: isError ? errorMessage : null,
    children: /*#__PURE__*/_jsx(Input, Object.assign({}, getTransferableProps(rest), {
      className: className,
      currency: currencyCode,
      formatter: formatter,
      onChange: onChange,
      value: value
    }))
  });
};

FilterOperatorNumberInput.propTypes = {
  className: PropTypes.string,
  currencyCode: PropTypes.string.isRequired,
  error: FilterOperatorErrorType.isRequired,
  numberDisplayHint: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  showCurrencySymbol: PropTypes.bool.isRequired,
  value: PropTypes.number
};
export default FilterOperatorNumberInput;