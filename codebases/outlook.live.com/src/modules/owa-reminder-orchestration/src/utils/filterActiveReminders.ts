import type ParsedReminder from '../store/schema/ParsedReminder';
import ReminderGroupTypes from 'owa-service/lib/contract/ReminderGroupTypes';
import { OwaDate, getTimestamp, timestamp, compare } from 'owa-datetime';

export default function filterActiveReminders(reminders: ParsedReminder[]) {
    const filteredReminders = (reminders ?? []).filter(reminder => {
        let now = timestamp();
        return shouldShowReminder(
            reminder.parsedEndDate,
            reminder.parsedReminderTime,
            now,
            reminder.ReminderGroupTypes
        );
    });

    filteredReminders?.sort((a, b) => {
        // Show the earlier events first
        // In the case where events start simultaneously, sort by ItemId so the sort remains stable.
        return (
            compare(a.parsedStartDate, b.parsedStartDate) || (a.ItemId.Id > b.ItemId.Id ? 1 : -1)
        );
    });

    return filteredReminders;
}

function shouldShowReminder(
    endTime: OwaDate,
    reminderTime: OwaDate,
    now: number,
    reminderType?: ReminderGroupTypes
): boolean {
    // For events, active reminders are those whose events have not yet ended,
    // and whose reminder time has passed
    // For tasks, active reminders are those whose reminder time has passed
    if (reminderType !== ReminderGroupTypes.Task) {
        return getTimestamp(endTime) > now && getTimestamp(reminderTime) < now;
    } else {
        return getTimestamp(reminderTime) < now;
    }
}
