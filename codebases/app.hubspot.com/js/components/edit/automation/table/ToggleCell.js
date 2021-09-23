'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { useCallback } from 'react';
import I18n from 'I18n';
import { useSelector, useDispatch } from 'react-redux';
import { updateFlowEnabled } from 'SequencesUI/actions/FlowActions';
import { canWrite, canEditWorkflows, canEditSequencesContextualWorkflows } from 'SequencesUI/lib/permissions';
import { selectFlowById } from 'SequencesUI/selectors/flowSelectors';
import UIToggle from 'UIComponents/input/UIToggle';
import EditSequenceTooltip from 'SequencesUI/components/edit/EditSequenceTooltip';
import WorkflowPermissionTooltip from './WorkflowPermissionTooltip';

function wrapWithTooltip(childNode) {
  if (!canWrite()) {
    return /*#__PURE__*/_jsx(EditSequenceTooltip, {
      children: childNode
    });
  }

  if (!canEditWorkflows()) {
    return /*#__PURE__*/_jsx(WorkflowPermissionTooltip, {
      disabled: canEditWorkflows(),
      children: childNode
    });
  }

  return childNode;
}

var ToggleCell = function ToggleCell(_ref) {
  var flowId = _ref.flowId;
  var flow = useSelector(selectFlowById(flowId));
  var dispatch = useDispatch();
  var toggleFlowEnabled = useCallback(function (_ref2) {
    var checked = _ref2.target.checked;
    dispatch(updateFlowEnabled({
      flowId: flowId,
      isEnabled: checked
    }));
  }, [dispatch, flowId]);

  var toggle = /*#__PURE__*/_jsx(UIToggle, {
    "aria-label": I18n.text('edit.automation.unenroll.checkboxAriaLabel'),
    readOnly: !canEditSequencesContextualWorkflows(),
    checked: flow.isEnabled,
    onChange: toggleFlowEnabled,
    id: flowId + "-flow-toggle",
    size: "xs"
  });

  return /*#__PURE__*/_jsx("td", {
    children: wrapWithTooltip(toggle)
  });
};

ToggleCell.propTypes = {
  flowId: PropTypes.number.isRequired
};
export default ToggleCell;