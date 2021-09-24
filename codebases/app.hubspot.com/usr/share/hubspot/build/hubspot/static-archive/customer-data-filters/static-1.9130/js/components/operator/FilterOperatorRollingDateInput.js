'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import FilterOperatorRollingDateRangeInput from './FilterOperatorRollingDateRangeInput';
import FormattedMessage from 'I18n/components/FormattedMessage';
import InRollingDateRange from 'customer-data-filters/filterQueryFormat/operator/InRollingDateRange';
import PropTypes from 'prop-types';
import { memo } from 'react';
import SyntheticEvent from 'UIComponents/core/SyntheticEvent';
import UIFormControl from 'UIComponents/form/UIFormControl';
import UINumberInput from 'UIComponents/input/UINumberInput';

var FilterOperatorRollingDateInput = function FilterOperatorRollingDateInput(props) {
  var className = props.className,
      isRollingDateOffsetInputEnabled = props.isRollingDateOffsetInputEnabled,
      _onChange = props.onChange,
      style = props.style,
      value = props.value,
      rest = _objectWithoutProperties(props, ["className", "isRollingDateOffsetInputEnabled", "onChange", "style", "value"]);

  return /*#__PURE__*/_jsxs("div", {
    className: className,
    style: style,
    children: [/*#__PURE__*/_jsx(FilterOperatorRollingDateRangeInput, Object.assign({
      onChange: _onChange,
      value: value
    }, rest)), isRollingDateOffsetInputEnabled && /*#__PURE__*/_jsx(UIFormControl, {
      className: "p-all-0",
      label: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "customerDataFilters.FilterOperatorRollingDateInput.offsetLabel"
      }),
      children: /*#__PURE__*/_jsx(UINumberInput, {
        onChange: function onChange(evt) {
          var newRollingOffset = evt.target.value;

          _onChange(SyntheticEvent(value.set('rollingOffset', newRollingOffset)));
        },
        placeholder: 0,
        value: value.rollingOffset
      })
    })]
  });
};

FilterOperatorRollingDateInput.propTypes = {
  className: PropTypes.string,
  isRollingDateOffsetInputEnabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  style: PropTypes.object,
  value: PropTypes.oneOfType([PropTypes.instanceOf(InRollingDateRange)]).isRequired
};
export default /*#__PURE__*/memo(FilterOperatorRollingDateInput);