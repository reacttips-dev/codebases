'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { selectFlowById } from 'SequencesUI/selectors/flowSelectors';
import { getFirstAction } from 'SequencesUI/util/automation/flowUtils';
import { getActionTypeFromAction } from '../lib/Actions';
import { ActionTypes } from '../lib/ActionDefinitions';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';

var ActionCell = function ActionCell(_ref) {
  var flowId = _ref.flowId;
  var flow = useSelector(selectFlowById(flowId));
  var action = getFirstAction(flow);
  var actionType = getActionTypeFromAction(action);
  var label = '';

  if (actionType === ActionTypes.ENROLL_IN_SEQUENCE) {
    label = /*#__PURE__*/_jsx(FormattedHTMLMessage, {
      message: "sequencesAutomation.action.enroll.cellLabel.labelWithoutSenderInfo"
    });
  } else if (actionType === ActionTypes.UNENROLL_FROM_SEQUENCE) {
    label = /*#__PURE__*/_jsx(FormattedHTMLMessage, {
      message: "sequencesAutomation.action.unenroll.cellLabel.contact"
    });
  }

  return /*#__PURE__*/_jsx("td", {
    children: label
  });
};

ActionCell.propTypes = {
  flowId: PropTypes.number.isRequired
};
export default ActionCell;