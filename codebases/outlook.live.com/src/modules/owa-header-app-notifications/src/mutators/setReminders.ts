import { mutatorAction } from 'satcheljs';
import type { ParsedReminder } from 'owa-reminder-orchestration';
import getStore from '../store/store';

export default mutatorAction('SET_ACTIVE_REMINDERS', (reminders: ParsedReminder[]) => {
    getStore().reminders = reminders.map(reminder => ({
        subject: reminder.Subject,
        startTime: reminder.parsedStartDate,
        endTime: reminder.parsedEndDate,
        reminderTime: reminder.parsedReminderTime,
        location: reminder.Location,
        itemId: reminder.ItemId,
        charmId: reminder.CharmId,
        reminderType: reminder.ReminderGroupTypes,
    }));
});
