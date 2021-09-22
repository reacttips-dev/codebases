import type ParsedReminder from '../store/schema/ParsedReminder';
import ReminderGroupTypes from 'owa-service/lib/contract/ReminderGroupTypes';
import { MAX_MS_FOR_TIMER } from './ReminderWindowConstants';
import { OwaDate, getTimestamp, timestamp } from 'owa-datetime';

export default function getTimeToNextReminder(reminders: ParsedReminder[]) {
    // Use a single "now" value to prevent a reminder slipping through the crack during processing
    const now = timestamp();

    let nextReminder: {
        reminder: ParsedReminder | null;
        refreshTime: number;
    } = {
        reminder: null,
        refreshTime: Number.MAX_VALUE,
    };

    // We want to select the time, either the reminder time or the meeting end time,
    // that is the next-most-recent after now.
    reminders.forEach(reminder => {
        let refreshTime = getReminderTriggerTime(
            reminder.parsedEndDate,
            reminder.parsedReminderTime,
            now,
            reminder.ReminderGroupTypes
        );

        if (refreshTime > now && refreshTime < nextReminder.refreshTime) {
            nextReminder = {
                reminder,
                refreshTime,
            };
        }
    });

    if (!nextReminder.reminder) {
        return -1;
    }

    // if the timer is too big, don't schedule the timer, it will be handled in later refresh
    let timeToNextReminder = nextReminder.refreshTime - now;
    return timeToNextReminder > MAX_MS_FOR_TIMER ? -1 : timeToNextReminder;
}

function getReminderTriggerTime(
    endTime: OwaDate,
    reminderTime: OwaDate,
    now: number,
    reminderType?: ReminderGroupTypes
): number {
    return reminderType != ReminderGroupTypes.Task
        ? Math.min(getTimestamp(endTime), Math.max(getTimestamp(reminderTime), now))
        : Math.max(getTimestamp(reminderTime), now);
}
