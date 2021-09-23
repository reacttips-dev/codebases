'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedHTMLMessage';
import UITooltip from 'UIComponents/tooltip/UITooltip';

var WorkflowPermissionTooltip = function WorkflowPermissionTooltip(_ref) {
  var children = _ref.children,
      _ref$disabled = _ref.disabled,
      disabled = _ref$disabled === void 0 ? true : _ref$disabled,
      placement = _ref.placement;
  return /*#__PURE__*/_jsx(UITooltip, {
    title: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "sequencesAutomation.button.wrongWorkflowPermission"
    }),
    disabled: disabled,
    placement: placement,
    children: children
  });
};

WorkflowPermissionTooltip.propTypes = {
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  placement: PropTypes.string
};
export default WorkflowPermissionTooltip;