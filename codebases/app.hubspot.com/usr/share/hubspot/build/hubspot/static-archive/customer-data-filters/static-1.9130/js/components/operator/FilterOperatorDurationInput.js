'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { DAYS, HOURS, MINUTES, formatDurationToMilliseconds, formatDurationToUnit, getDefaultUnit } from '../../utilities/durationUtilities';
import FilterOperatorErrorType from 'customer-data-filters/components/propTypes/FilterOperatorErrorType';
import I18n from 'I18n';
import PropTypes from 'prop-types';
import { useState } from 'react';
import SyntheticEvent from 'UIComponents/core/SyntheticEvent';
import UIFormControl from 'UIComponents/form/UIFormControl';
import UIInputGroup from 'UIComponents/form/UIInputGroup';
import UINumberInput from 'UIComponents/input/UINumberInput';
import UISelect from 'UIComponents/input/UISelect';

var FilterOperatorDurationInput = function FilterOperatorDurationInput(props) {
  var className = props.className,
      error = props.error,
      onChange = props.onChange,
      initialDuration = props.value;
  var isError = error.get('error');
  var errorMessage = error.get('message');
  var initialUnit = getDefaultUnit(initialDuration);

  var _useState = useState(formatDurationToUnit(initialDuration, initialUnit)),
      _useState2 = _slicedToArray(_useState, 2),
      durationInput = _useState2[0],
      updateDurationInput = _useState2[1];

  var _useState3 = useState(initialUnit),
      _useState4 = _slicedToArray(_useState3, 2),
      currentUnit = _useState4[0],
      updateCurrentUnit = _useState4[1];

  var langKey = 'customerDataFilters.FilterOperatorDurationInput.DurationUnits';
  var DurationUnitOptions = [{
    text: I18n.text(langKey + ".minutes", {
      count: durationInput || 0
    }),
    value: MINUTES
  }, {
    text: I18n.text(langKey + ".hours", {
      count: durationInput || 0
    }),
    value: HOURS
  }, {
    text: I18n.text(langKey + ".days", {
      count: durationInput || 0
    }),
    value: DAYS
  }];

  var handleValueChange = function handleValueChange(event) {
    var value = event.target.value;

    if (typeof value !== 'number') {
      onChange(SyntheticEvent(null));
      return;
    }

    var valueInMilliseconds = Math.floor(formatDurationToMilliseconds(value, currentUnit));
    updateDurationInput(value);
    onChange(SyntheticEvent(valueInMilliseconds));
  };

  var handleUnitChange = function handleUnitChange(event) {
    var value = event.target.value;
    updateCurrentUnit(value);

    if (typeof durationInput !== 'number') {
      onChange(SyntheticEvent(null));
      return;
    }

    var valueInMilliseconds = Math.floor(formatDurationToMilliseconds(durationInput, value));
    onChange(SyntheticEvent(valueInMilliseconds));
  };

  return /*#__PURE__*/_jsxs(UIInputGroup, {
    className: className,
    use: "itemBoth",
    children: [/*#__PURE__*/_jsx(UIFormControl, {
      error: isError,
      validationMessage: isError ? errorMessage : null,
      children: /*#__PURE__*/_jsx(UINumberInput, {
        formatter: function formatter(value) {
          return value != null ? I18n.formatNumber(value, {
            precision: 3
          }) : '';
        },
        onChange: handleValueChange,
        value: durationInput
      })
    }), /*#__PURE__*/_jsx(UIFormControl, {
      children: /*#__PURE__*/_jsx(UISelect, {
        clearable: false,
        onChange: handleUnitChange,
        options: DurationUnitOptions,
        value: currentUnit
      })
    })]
  });
};

FilterOperatorDurationInput.propTypes = {
  className: PropTypes.string,
  error: FilterOperatorErrorType.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.number
};
export default FilterOperatorDurationInput;