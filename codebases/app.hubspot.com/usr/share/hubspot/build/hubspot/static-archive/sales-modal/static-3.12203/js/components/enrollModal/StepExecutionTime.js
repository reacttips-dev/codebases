'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import I18n from 'I18n';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { getDateAndTime } from '../../utils/enrollModal/getDateAndTime';
import { SCHEDULE_TASK } from 'sales-modal/constants/SequenceStepTypes';
import StepTimeReadOnlyViewTooltip from './timeSelection/StepTimeReadOnlyViewTooltip';
export default function StepExecutionTime(_ref) {
  var completedStep = _ref.completedStep,
      timezone = _ref.timezone,
      showReadOnlyTooltip = _ref.showReadOnlyTooltip,
      readOnlyTooltipProps = _ref.readOnlyTooltipProps;
  var action = completedStep.getIn(['step', 'action']);
  var executedMoment = I18n.moment(completedStep.get('executedTimestamp'));
  executedMoment = timezone ? executedMoment.tz(timezone) : executedMoment;
  var message;

  if (action === SCHEDULE_TASK) {
    message = 'enrollModal.sequenceTimeline.completed.SCHEDULE_TASK_V2';
  } else {
    message = 'enrollModal.sequenceTimeline.completed.SEND_TEMPLATE';
  }

  var stepExecutionTimeNode = /*#__PURE__*/_jsx(FormattedMessage, {
    message: message,
    options: getDateAndTime(executedMoment)
  });

  if (showReadOnlyTooltip) {
    return /*#__PURE__*/_jsx(StepTimeReadOnlyViewTooltip, Object.assign({}, readOnlyTooltipProps, {
      children: stepExecutionTimeNode
    }));
  }

  return stepExecutionTimeNode;
}