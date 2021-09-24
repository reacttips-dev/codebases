'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { selectFlowById } from 'SequencesUI/selectors/flowSelectors';
import TriggerCell from './TriggerCell';
import ActionCell from './ActionCell';
import ToggleCell from './ToggleCell';

var AutomationTableRow = function AutomationTableRow(_ref) {
  var flowId = _ref.flowId,
      openFlowPanel = _ref.openFlowPanel,
      handleDeleteClick = _ref.handleDeleteClick;
  var flow = useSelector(selectFlowById(flowId));

  if (!flow) {
    return null;
  }

  return /*#__PURE__*/_jsxs("tr", {
    "data-test-id": "automation-" + flowId,
    children: [/*#__PURE__*/_jsx(TriggerCell, {
      flowId: flowId,
      openFlowPanel: openFlowPanel,
      handleDeleteClick: handleDeleteClick
    }), /*#__PURE__*/_jsx(ActionCell, {
      flowId: flowId
    }), /*#__PURE__*/_jsx(ToggleCell, {
      flowId: flowId
    })]
  });
};

AutomationTableRow.propTypes = {
  flowId: PropTypes.number.isRequired,
  openFlowPanel: PropTypes.func.isRequired,
  handleDeleteClick: PropTypes.func.isRequired
};
export default AutomationTableRow;