'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import Big from 'UIComponents/elements/Big';
import UIFlex from 'UIComponents/layout/UIFlex';

var SnippetsPopoverErrorState = function SnippetsPopoverErrorState() {
  return /*#__PURE__*/_jsx(UIFlex, {
    direction: "column",
    align: "center",
    className: "p-all-10",
    children: /*#__PURE__*/_jsx(Big, {
      className: "text-center",
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "draftPlugins.snippetsPlugin.fetchError"
      })
    })
  });
};

export default SnippetsPopoverErrorState;