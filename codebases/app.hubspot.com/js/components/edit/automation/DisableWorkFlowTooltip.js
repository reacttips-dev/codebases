'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import UITooltip from 'UIComponents/tooltip/UITooltip';
import FormattedMessage from 'I18n/components/FormattedMessage';

var DisableWorkFlowTooltip = function DisableWorkFlowTooltip(_ref) {
  var children = _ref.children;
  return /*#__PURE__*/_jsx(UITooltip, {
    title: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "sequencesAutomation.button.disableCreateWorkflow"
    }),
    children: children
  });
};

export default DisableWorkFlowTooltip;