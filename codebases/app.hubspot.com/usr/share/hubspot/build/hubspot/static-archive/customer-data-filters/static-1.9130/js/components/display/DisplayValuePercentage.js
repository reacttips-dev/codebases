'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import FormattedPercentage from 'I18n/components/FormattedPercentage';
import PropTypes from 'prop-types';
export default function DisplayValuePercentage(_ref) {
  var value = _ref.value;
  return /*#__PURE__*/_jsx(FormattedPercentage, {
    precision: 2,
    stripInsignificantZeros: true,
    value: value * 100
  });
}
DisplayValuePercentage.propTypes = {
  value: PropTypes.number.isRequired
};