import onUpdateActiveReminders from '../actions/onUpdateActiveReminders';
import filterActiveReminders from '../utils/filterActiveReminders';
import getTimeToNextReminder from '../utils/getTimeToNextReminder';
import getRemindersForAccount from '../selectors/getRemindersForAccount';

let currentReminderTimer: number | null = null;

export default function pushActiveRemindersAndSetTimeout(userIdentity: string | null) {
    if (currentReminderTimer) {
        clearTimeout(currentReminderTimer);
    }

    const reminders = getRemindersForAccount(userIdentity) ?? [];
    onUpdateActiveReminders(filterActiveReminders(reminders));

    const timeToNextReminder = getTimeToNextReminder(reminders);
    if (timeToNextReminder > 0) {
        currentReminderTimer = window.setTimeout(
            userIdentity => pushActiveRemindersAndSetTimeout(userIdentity),
            timeToNextReminder
        );
    }
}
