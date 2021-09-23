'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
import H3 from 'UIComponents/elements/headings/H3';
import UIFlex from 'UIComponents/layout/UIFlex';

var BulkEnrollLoading = function BulkEnrollLoading() {
  return /*#__PURE__*/_jsxs(UIFlex, {
    justify: "center",
    align: "center",
    className: "sequences-enroll-modal-loading",
    direction: "column",
    children: [/*#__PURE__*/_jsx(H3, {
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "bulkEnroll.loading"
      })
    }), /*#__PURE__*/_jsx(UILoadingSpinner, {})]
  });
};

export default BulkEnrollLoading;