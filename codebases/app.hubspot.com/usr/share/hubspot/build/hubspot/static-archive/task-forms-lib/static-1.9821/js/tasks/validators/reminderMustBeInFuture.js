'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { Map as ImmutableMap } from 'immutable';
import I18n from 'I18n';
import FormattedMessage from 'I18n/components/FormattedMessage';
import getFirstReminder from '../getters/getFirstReminder';
var NO_ERROR = ImmutableMap();
export default function reminderMustBeInFuture(task) {
  var reminder = getFirstReminder({
    task: task,
    field: 'hs_task_reminders'
  });
  if (!reminder) return NO_ERROR;
  var isInPast = I18n.moment.userTz(reminder).isBefore(I18n.moment.userTz());

  if (isInPast) {
    return ImmutableMap({
      errors: ImmutableMap({
        hs_task_reminders: true
      }),
      messages: ImmutableMap({
        hs_task_reminders: /*#__PURE__*/_jsx(FormattedMessage, {
          message: 'taskFormsLib.validators.reminderMustBeInFuture'
        })
      })
    });
  }

  return NO_ERROR;
}