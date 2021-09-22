import { mutatorAction } from 'satcheljs';
import type ParsedReminder from '../store/schema/ParsedReminder';
import { OwaDate, getEwsRequestString } from 'owa-datetime';

export default mutatorAction(
    'SET_REMINDER_TIME',
    (reminder: ParsedReminder, newReminderTime: OwaDate) => {
        reminder.ReminderTime = getEwsRequestString(newReminderTime);
        reminder.parsedReminderTime = newReminderTime;
    }
);
