'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import FilterOperatorType from 'customer-data-filters/components/propTypes/FilterOperatorType';
import FormattedMessage from 'I18n/components/FormattedMessage';

var DisplayValueRollingInequalityWithUnit = function DisplayValueRollingInequalityWithUnit(_ref) {
  var operator = _ref.operator;
  var key = "customerDataFilters.DisplayValueRollingInequalityWithUnit." + operator.direction + "." + operator.timeUnit;
  return /*#__PURE__*/_jsx(FormattedMessage, {
    message: key,
    options: {
      count: operator.value
    }
  });
};

DisplayValueRollingInequalityWithUnit.propTypes = {
  operator: FilterOperatorType.isRequired
};
export default DisplayValueRollingInequalityWithUnit;