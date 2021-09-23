'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIDialogBody from 'UIComponents/dialog/UIDialogBody';
import UIErrorMessage from 'UIComponents/error/UIErrorMessage';

var AssignmentPanelErrorState = function AssignmentPanelErrorState() {
  return /*#__PURE__*/_jsx(UIDialogBody, {
    children: /*#__PURE__*/_jsxs(UIErrorMessage, {
      children: [/*#__PURE__*/_jsxs("p", {
        children: [/*#__PURE__*/_jsx(FormattedMessage, {
          message: "salesContentPartitioning.assignmentPanelError.somethingsGoneWrong"
        }), /*#__PURE__*/_jsx("br", {}), /*#__PURE__*/_jsx(FormattedMessage, {
          message: "salesContentPartitioning.assignmentPanelError.refreshThePage"
        })]
      }), /*#__PURE__*/_jsx("p", {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "salesContentPartitioning.assignmentPanelError.contactSupport"
        })
      })]
    })
  });
};

export default AssignmentPanelErrorState;