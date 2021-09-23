'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import FilterOperatorErrorType from 'customer-data-filters/components/propTypes/FilterOperatorErrorType';
import GreaterThanRolling from 'customer-data-filters/filterQueryFormat/operator/GreaterThanRolling';
import I18n from 'I18n';
import LessThanRolling from 'customer-data-filters/filterQueryFormat/operator/LessThanRolling';
import PropTypes from 'prop-types';
import SyntheticEvent from 'UIComponents/core/SyntheticEvent';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIFormControl from 'UIComponents/form/UIFormControl';
import UINumberInput from 'UIComponents/input/UINumberInput';
import UISelect from 'UIComponents/input/UISelect';

var FilterOperatorRollingWithUnitInput = function FilterOperatorRollingWithUnitInput(props) {
  var className = props.className,
      error = props.error,
      onChange = props.onChange,
      value = props.value;

  var handleChangeDirection = function handleChangeDirection(_ref) {
    var direction = _ref.target.value;
    return onChange(SyntheticEvent(value.set('direction', direction)));
  };

  var handleChangeValue = function handleChangeValue(_ref2) {
    var time = _ref2.target.value;
    return onChange(SyntheticEvent(value.merge({
      direction: value.direction || 'backward',
      value: time,
      timeUnit: value.timeUnit || 'days'
    })));
  };

  var handleChangeTimeUnit = function handleChangeTimeUnit(_ref3) {
    var timeUnit = _ref3.target.value;
    return onChange(SyntheticEvent(value.set('timeUnit', timeUnit)));
  };

  var directionOptions = [{
    text: I18n.text('customerDataFilters.FilterEditorOperatorRollingUnitInput.directionOptionLabelBackward'),
    value: 'backward'
  }, {
    text: I18n.text('customerDataFilters.FilterEditorOperatorRollingUnitInput.directionOptionLabelForward'),
    value: 'forward'
  }];
  var unitOptions = [{
    text: I18n.text('customerDataFilters.FilterEditorOperatorRollingUnitInput.days'),
    value: 'days'
  }, {
    text: I18n.text('customerDataFilters.FilterEditorOperatorRollingUnitInput.weeks'),
    value: 'weeks'
  }];
  return /*#__PURE__*/_jsxs(UIFlex, {
    align: "baseline",
    className: className,
    children: [/*#__PURE__*/_jsx(UIFormControl, {
      error: error.error,
      validationMessage: error.error ? error.message : null,
      children: /*#__PURE__*/_jsx(UINumberInput, {
        defaultValue: 1,
        min: 1,
        onChange: handleChangeValue,
        value: value.value
      })
    }), /*#__PURE__*/_jsx(UISelect, {
      buttonUse: "unstyled",
      className: "m-left-2",
      defaultValue: "days",
      onChange: handleChangeTimeUnit,
      options: unitOptions,
      value: value.timeUnit
    }), /*#__PURE__*/_jsx(UISelect, {
      buttonUse: "unstyled",
      className: "m-left-2",
      defaultValue: "backward",
      onChange: handleChangeDirection,
      options: directionOptions,
      value: value.direction
    })]
  });
};

FilterOperatorRollingWithUnitInput.propTypes = {
  className: PropTypes.string,
  error: FilterOperatorErrorType,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.instanceOf(GreaterThanRolling).isRequired, PropTypes.instanceOf(LessThanRolling).isRequired]).isRequired
};
export default FilterOperatorRollingWithUnitInput;