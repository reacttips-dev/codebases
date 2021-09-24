'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { InRollingDateRange } from 'customer-data-filters/filterQueryFormat/operator/Operators';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import RollingDateConfig from 'customer-data-filters/filterQueryFormat/rollingDates/RollingDateConfig';

var DisplayValueRollingDate = function DisplayValueRollingDate(props) {
  var operator = props.operator,
      value = props.value;
  var i18nToken = useMemo(function () {
    return RollingDateConfig.toRollingDateOptionValue(value);
  }, [value]);
  return /*#__PURE__*/_jsxs("span", {
    children: [/*#__PURE__*/_jsx(FormattedHTMLMessage, {
      message: "customerDataFilters.RollingDates.options.text." + i18nToken
    }), operator && operator.rollingOffset ? /*#__PURE__*/_jsx(FormattedHTMLMessage, {
      message: "customerDataFilters.DisplayValueRollingDateWithOffset.label",
      options: {
        number: operator.rollingOffset
      }
    }) : null]
  });
};

DisplayValueRollingDate.propTypes = {
  operator: PropTypes.instanceOf(InRollingDateRange),
  value: PropTypes.instanceOf(RollingDateConfig)
};
export default DisplayValueRollingDate;