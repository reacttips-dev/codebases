'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import * as FiscalYearRollingDateOptionsValues from 'customer-data-filters/filterQueryFormat/rollingDates/FiscalYearRollingDateOptionsValues';
import * as RollingDateOptions from '../../filterQueryFormat/rollingDates/RollingDateOptions';
import { Seq } from 'immutable';
import FilterOperatorErrorType from 'customer-data-filters/components/propTypes/FilterOperatorErrorType';
import I18n from 'I18n';
import InRollingDateRange from 'customer-data-filters/filterQueryFormat/operator/InRollingDateRange';
import PropTypes from 'prop-types';
import RollingDateConfig from 'customer-data-filters/filterQueryFormat/rollingDates/RollingDateConfig';
import SyntheticEvent from 'UIComponents/core/SyntheticEvent';
import UIFormControl from 'UIComponents/form/UIFormControl';
import UISelect from 'UIComponents/input/UISelect';
import memoize from 'transmute/memoize';
var createRollingDateOptions = memoize(function (isFiscalYearEnabled) {
  return Seq(RollingDateOptions).filterNot(function (option) {
    return !isFiscalYearEnabled && FiscalYearRollingDateOptionsValues[option.value];
  }).map(function (option) {
    return {
      help: I18n.text(option.helpToken),
      text: I18n.text(option.textToken),
      value: option.value
    };
  }).toArray();
});

var FilterOperatorRollingDateRangeInput = function FilterOperatorRollingDateRangeInput(props) {
  var className = props.className,
      isFiscalYearEnabled = props.isFiscalYearEnabled,
      error = props.error,
      onChange = props.onChange,
      value = props.value;
  var options = createRollingDateOptions(isFiscalYearEnabled);
  var isError = error.get('error');
  var errorMessage = error.get('message');

  var handleChange = function handleChange(evt) {
    var newValue = RollingDateConfig.fromRollingDateOptionValue(evt.target.value);
    onChange(SyntheticEvent(value.set('value', newValue)));
  };

  var rollingDateOptionValue = RollingDateConfig.toRollingDateOptionValue(value.value);
  return /*#__PURE__*/_jsx(UIFormControl, {
    error: isError,
    validationMessage: errorMessage,
    children: /*#__PURE__*/_jsx(UISelect, {
      className: className,
      onChange: handleChange,
      options: options,
      value: rollingDateOptionValue
    })
  });
};

FilterOperatorRollingDateRangeInput.propTypes = {
  className: PropTypes.string,
  error: FilterOperatorErrorType.isRequired,
  isFiscalYearEnabled: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.instanceOf(InRollingDateRange).isRequired
};
export default FilterOperatorRollingDateRangeInput;