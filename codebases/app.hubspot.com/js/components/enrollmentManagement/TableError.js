'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { NavMarker } from 'react-rhumb';
import UIErrorMessage from 'UIComponents/error/UIErrorMessage';
export var TableError = function TableError(_ref) {
  var navMarkerName = _ref.navMarkerName;
  return /*#__PURE__*/_jsxs(UIErrorMessage, {
    type: "badRequest",
    children: [navMarkerName ? /*#__PURE__*/_jsx(NavMarker, {
      name: navMarkerName
    }) : null, /*#__PURE__*/_jsxs("p", {
      children: [/*#__PURE__*/_jsx(FormattedMessage, {
        message: "summary.summarySearchFailed.refreshPage"
      }), /*#__PURE__*/_jsx("br", {}), /*#__PURE__*/_jsx(FormattedMessage, {
        message: "summary.summarySearchFailed.contactSupport"
      })]
    })]
  });
};
TableError.propTypes = {
  navMarkerName: PropTypes.string
};
export default TableError;