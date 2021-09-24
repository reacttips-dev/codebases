'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { selectFlowById } from 'SequencesUI/selectors/flowSelectors';
import { getFirstTrigger } from 'SequencesUI/util/automation/flowUtils';
import { getTriggerTypeFromTrigger } from '../lib/Triggers';
import { TriggerTypes } from '../lib/TriggerDefinitions';
import FormLabel from './trigger/FormLabel';
import PageviewLabel from './trigger/PageviewLabel';

var TriggerCellLabel = function TriggerCellLabel(_ref) {
  var flowId = _ref.flowId;
  var flow = useSelector(selectFlowById(flowId));
  var trigger = getFirstTrigger(flow);
  var triggerType = getTriggerTypeFromTrigger(trigger);
  var label = '';

  if (triggerType === TriggerTypes.FORM_SUBMISSION) {
    label = /*#__PURE__*/_jsx(FormLabel, {
      trigger: trigger
    });
  } else if (triggerType === TriggerTypes.PAGEVIEW) {
    label = /*#__PURE__*/_jsx(PageviewLabel, {
      trigger: trigger
    });
  }

  return label;
};

TriggerCellLabel.propTypes = {
  flowId: PropTypes.number.isRequired
};
export default TriggerCellLabel;