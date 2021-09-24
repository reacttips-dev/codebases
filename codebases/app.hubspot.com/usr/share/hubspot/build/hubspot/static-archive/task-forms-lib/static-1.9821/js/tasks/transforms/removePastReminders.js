'use es6';

import I18n from 'I18n';
import getFirstReminder from '../getters/getFirstReminder';
export default function removePastReminders(_ref) {
  var task = _ref.task,
      updates = _ref.updates,
      edit = _ref.edit;

  if (!edit) {
    return updates;
  }

  var reminder = getFirstReminder({
    task: task,
    updates: updates
  });

  if (I18n.moment.userTz().isAfter(reminder)) {
    return updates.set('hs_task_reminders', null);
  }

  return updates;
}