'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIErrorMessage from 'UIComponents/error/UIErrorMessage';
import UIFlex from 'UIComponents/layout/UIFlex';
export default function EnrollmentReaganTimeoutError() {
  return /*#__PURE__*/_jsx(UIFlex, {
    align: "center",
    justify: "center",
    className: "enroll-reagan-timeout-error",
    children: /*#__PURE__*/_jsxs(UIErrorMessage, {
      children: [/*#__PURE__*/_jsxs("p", {
        children: [/*#__PURE__*/_jsx(FormattedMessage, {
          message: "enrollModal.generalError.somethingsGoneWrong"
        }), /*#__PURE__*/_jsx("br", {}), /*#__PURE__*/_jsx(FormattedMessage, {
          message: "enrollModal.generalError.refreshPage"
        })]
      }), /*#__PURE__*/_jsx("p", {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "enrollModal.generalError.contactSupport"
        })
      })]
    })
  });
}