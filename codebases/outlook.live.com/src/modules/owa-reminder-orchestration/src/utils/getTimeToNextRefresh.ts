import type ParsedReminder from '../store/schema/ParsedReminder';
import {
    addMilliseconds,
    getTimestamp,
    timestamp,
    differenceInMilliseconds,
    now,
} from 'owa-datetime';
import {
    MAX_MS_BEFORE_REFRESH,
    REMINDER_WINDOW_OVERLAP_MS,
    MIN_MS_BEFORE_REFRESH,
} from '../utils/ReminderWindowConstants';

export default function getTimeToNextRefresh(reminders: ParsedReminder[]) {
    let lastReminder: ParsedReminder | undefined;

    reminders.forEach(reminder => {
        let reminderTime = getTimestamp(reminder.parsedReminderTime);
        if (
            reminderTime > timestamp() &&
            (!lastReminder || reminderTime < getTimestamp(lastReminder.parsedReminderTime))
        ) {
            lastReminder = reminder;
        }
    });

    if (lastReminder === undefined) {
        return MAX_MS_BEFORE_REFRESH;
    }

    return Math.max(
        MIN_MS_BEFORE_REFRESH,
        Math.min(
            differenceInMilliseconds(
                addMilliseconds(lastReminder!.parsedReminderTime, -REMINDER_WINDOW_OVERLAP_MS),
                now()
            ),
            MAX_MS_BEFORE_REFRESH
        )
    );
}
