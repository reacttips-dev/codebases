'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import FilterOperatorType from 'customer-data-filters/components/propTypes/FilterOperatorType';
import FormattedMessage from 'I18n/components/FormattedMessage';

var DisplayValueRollingInequality = function DisplayValueRollingInequality(_ref) {
  var operator = _ref.operator;
  var key = "customerDataFilters.DisplayValueRollingInequality." + operator.direction;
  return /*#__PURE__*/_jsx(FormattedMessage, {
    message: key,
    options: {
      count: operator.numberOfDays
    }
  });
};

DisplayValueRollingInequality.propTypes = {
  operator: FilterOperatorType.isRequired
};
export default DisplayValueRollingInequality;