'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import FormattedDateTime from 'I18n/components/FormattedDateTime';
import FormattedMessage from 'I18n/components/FormattedMessage';
import I18n from 'I18n';
import PropTypes from 'prop-types';
export default function DisplayValueDate(_ref) {
  var value = _ref.value;

  if (!value) {
    return /*#__PURE__*/_jsx(FormattedMessage, {
      message: "customerDataFilters.DisplayValueDate.invalid"
    });
  }

  return /*#__PURE__*/_jsxs("span", {
    children: [/*#__PURE__*/_jsx(FormattedDateTime, {
      format: "L",
      type: "portalTz",
      value: I18n.moment.portalTz(value)
    }), " (" + I18n.moment.portalTz().format('z') + ")"]
  });
}
DisplayValueDate.propTypes = {
  value: PropTypes.string
};