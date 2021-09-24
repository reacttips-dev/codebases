'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import FormattedNumber from 'I18n/components/FormattedNumber';
import FormattedPercentage from 'I18n/components/FormattedPercentage';
import Small from 'UIComponents/elements/Small';
import { RATES } from './helpers';
export default function ValueCell(_ref) {
  var count = _ref.count,
      _ref$rate = _ref.rate,
      rate = _ref$rate === void 0 ? null : _ref$rate,
      display = _ref.display;

  var value = /*#__PURE__*/_jsx(FormattedNumber, {
    value: count
  });

  if (display === RATES && rate !== null) {
    if (isNaN(rate)) {
      value = /*#__PURE__*/_jsx(Small, {
        use: "help",
        children: "\u2014"
      });
    } else {
      value = /*#__PURE__*/_jsx(FormattedPercentage, {
        value: rate * 100
      });
    }
  }

  return /*#__PURE__*/_jsx("td", {
    align: "right",
    width: "150",
    children: value
  });
}