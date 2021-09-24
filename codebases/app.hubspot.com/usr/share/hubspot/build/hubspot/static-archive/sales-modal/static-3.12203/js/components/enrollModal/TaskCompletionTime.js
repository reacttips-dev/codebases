'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import I18n from 'I18n';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { getDateAndTime } from '../../utils/enrollModal/getDateAndTime';
export default function TaskCompletionTime(_ref) {
  var _ref$task = _ref.task,
      task = _ref$task === void 0 ? {} : _ref$task,
      timezone = _ref.timezone;

  if (!task.metadata.completionDate) {
    return null;
  }

  var completedMoment = I18n.moment(task.metadata.completionDate);
  completedMoment = timezone ? completedMoment.tz(timezone) : completedMoment;
  return /*#__PURE__*/_jsx(FormattedMessage, {
    message: "enrollModal.sequenceTimeline.taskCompleted",
    options: getDateAndTime(completedMoment)
  });
}